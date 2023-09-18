import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import MatchModel from '../models/MatchModel';
import { ITeamScores, ITeamScoresFinal } from '../../Interfaces/ITeamScores';
import { ITeamModel } from '../../Interfaces/ITeamModel';
import TeamModel from '../models/TeamModel';
import IMatch from '../../Interfaces/IMatch';

export default class LeaderboardService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
    private teamModel: ITeamModel = new TeamModel(),
  ) {}

  private async initializateLeaderboards(): Promise<ITeamScores> {
    const teams = await this.teamModel.findAll();
    const teamScores: ITeamScores = {};

    teams.forEach((team) => {
      teamScores[team.id] = {
        name: team.teamName,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
        goalsBalance: 0,
        efficiency: 0,
      };
    });

    return teamScores;
  }

  updateGoals = (match: IMatch, teamScores: ITeamScores, teamType: 'homeTeam' | 'awayTeam'):
  ITeamScores => {
    const updatedTeamScores = { ...teamScores };
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;
    const teamIdToUpdate = teamType === 'homeTeam' ? homeTeamId : awayTeamId;

    updatedTeamScores[teamIdToUpdate].goalsFavor += teamType === 'homeTeam'
      ? homeTeamGoals : awayTeamGoals;
    updatedTeamScores[teamIdToUpdate].goalsOwn += teamType === 'homeTeam'
      ? awayTeamGoals : homeTeamGoals;
    updatedTeamScores[teamIdToUpdate].totalGames += 1;

    return updatedTeamScores;
  };

  updateVictoriesAndPoints =
  (match: IMatch, teamScores: ITeamScores, teamType: 'homeTeam' | 'awayTeam'): ITeamScores => {
    const updatedTeamScores = { ...teamScores };
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;
    const teamIdToUpdate = teamType === 'homeTeam' ? homeTeamId : awayTeamId;

    if ((teamType === 'homeTeam' && homeTeamGoals > awayTeamGoals)
    || (teamType === 'awayTeam' && awayTeamGoals > homeTeamGoals)
    ) {
      updatedTeamScores[teamIdToUpdate].totalVictories += 1;
      updatedTeamScores[teamIdToUpdate].totalPoints += 3;
    } else if ((teamType === 'homeTeam' && awayTeamGoals > homeTeamGoals)
    || (teamType === 'awayTeam' && homeTeamGoals > awayTeamGoals)
    ) {
      updatedTeamScores[teamIdToUpdate].totalLosses += 1;
    } else {
      updatedTeamScores[teamIdToUpdate].totalDraws += 1;
      updatedTeamScores[teamIdToUpdate].totalPoints += 1;
    }

    return updatedTeamScores;
  };

  calculateBalanceAndEfficiency = (teamScores: ITeamScores): ITeamScoresFinal[] => {
    const leaderboard: ITeamScoresFinal[] = Object.keys(teamScores).map((teamId) => {
      const team = teamScores[teamId];
      team.goalsBalance = team.goalsFavor - team.goalsOwn;
      team.efficiency = parseFloat(((team.totalPoints / (team.totalGames * 3)) * 100).toFixed(2));
      return { id: parseInt(teamId, 10), ...team };
    });

    return leaderboard;
  };

  public async getAllLeaderboards(teamType: 'homeTeam' | 'awayTeam'):
  Promise<ServiceResponse<ITeamScoresFinal[]>> {
    const teamScores: ITeamScores = await this.initializateLeaderboards();
    const matches = (await this.matchModel.findAll()).filter((match) => !match.inProgress);

    const updatedTeamScores = this.calculateUpdatedTeamScores(matches, teamScores, teamType);
    const leaderboard = this.calculateBalanceAndEfficiency(updatedTeamScores);

    leaderboard.sort(this.compareTeams);

    return { status: 'SUCCESSFUL', data: leaderboard };
  }

  private calculateUpdatedTeamScores(
    matches: IMatch[],
    teamScores: ITeamScores,
    teamType: 'homeTeam' | 'awayTeam',
  ): ITeamScores {
    let updatedTeamScores = { ...teamScores };

    matches.forEach((match) => {
      updatedTeamScores = this.updateGoals(match, updatedTeamScores, teamType);
      updatedTeamScores = this.updateVictoriesAndPoints(match, updatedTeamScores, teamType);
    });

    return updatedTeamScores;
  }

  compareTeams = (teamA: ITeamScoresFinal, teamB: ITeamScoresFinal) => {
    if (teamA.totalPoints !== teamB.totalPoints) {
      return teamB.totalPoints - teamA.totalPoints;
    }
    if (teamA.totalVictories !== teamB.totalVictories) {
      return teamB.totalVictories - teamA.totalVictories;
    }
    if (teamA.goalsBalance !== teamB.goalsBalance) {
      return teamB.goalsBalance - teamA.goalsBalance;
    }
    return teamB.goalsFavor - teamA.goalsFavor;
  };
}
