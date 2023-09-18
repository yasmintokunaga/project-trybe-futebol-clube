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

  updateGoals = (match: IMatch, teamScores: ITeamScores): ITeamScores => {
    const updatedTeamScores = { ...teamScores };
    const { homeTeamId, homeTeamGoals, awayTeamGoals } = match;

    updatedTeamScores[homeTeamId].goalsFavor += homeTeamGoals;
    updatedTeamScores[homeTeamId].goalsOwn += awayTeamGoals;
    updatedTeamScores[homeTeamId].totalGames += 1;

    return updatedTeamScores;
  };

  updateVictoriesAndPoints = (match: IMatch, teamScores: ITeamScores): ITeamScores => {
    const updatedTeamScores = { ...teamScores };
    const { homeTeamId, homeTeamGoals, awayTeamGoals } = match;

    if (homeTeamGoals > awayTeamGoals) {
      updatedTeamScores[homeTeamId].totalVictories += 1;
      updatedTeamScores[homeTeamId].totalPoints += 3;
    } else if (awayTeamGoals > homeTeamGoals) {
      updatedTeamScores[homeTeamId].totalLosses += 1;
    } else {
      updatedTeamScores[homeTeamId].totalDraws += 1;
      updatedTeamScores[homeTeamId].totalPoints += 1;
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

  public async getAllLeaderboards(): Promise<ServiceResponse<ITeamScoresFinal[]>> {
    const teamScores: ITeamScores = await this.initializateLeaderboards();
    const matches = (await this.matchModel.findAll()).filter((match) => !match.inProgress);

    const updatedTeamScores = this.calculateUpdatedTeamScores(matches, teamScores);
    const leaderboard = this.calculateBalanceAndEfficiency(updatedTeamScores);

    leaderboard.sort(this.compareTeams);

    return { status: 'SUCCESSFUL', data: leaderboard };
  }

  private calculateUpdatedTeamScores(
    matches: IMatch[],
    teamScores: ITeamScores,
  ): ITeamScores {
    let updatedTeamScores = { ...teamScores };

    matches.forEach((match) => {
      updatedTeamScores = this.updateGoals(match, updatedTeamScores);
      updatedTeamScores = this.updateVictoriesAndPoints(match, updatedTeamScores);
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
