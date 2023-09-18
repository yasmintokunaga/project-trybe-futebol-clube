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
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;

    updatedTeamScores[homeTeamId].goalsFavor += homeTeamGoals;
    updatedTeamScores[homeTeamId].goalsOwn += awayTeamGoals;
    updatedTeamScores[homeTeamId].totalGames += 1;

    updatedTeamScores[awayTeamId].goalsFavor += awayTeamGoals;
    updatedTeamScores[awayTeamId].goalsOwn += homeTeamGoals;
    updatedTeamScores[awayTeamId].totalGames += 1;

    return updatedTeamScores;
  };

  updateVictoriesAndPoints = (match: IMatch, teamScores: ITeamScores): ITeamScores => {
    const updatedTeamScores = { ...teamScores };
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = match;

    if (homeTeamGoals > awayTeamGoals) {
      updatedTeamScores[homeTeamId].totalVictories += 1;
      updatedTeamScores[homeTeamId].totalPoints += 3;
      updatedTeamScores[awayTeamId].totalLosses += 1;
    } else if (awayTeamGoals > homeTeamGoals) {
      updatedTeamScores[awayTeamId].totalVictories += 1;
      updatedTeamScores[awayTeamId].totalPoints += 3;
      updatedTeamScores[homeTeamId].totalLosses += 1;
    } else {
      updatedTeamScores[homeTeamId].totalDraws += 1;
      updatedTeamScores[homeTeamId].totalPoints += 1;
      updatedTeamScores[awayTeamId].totalDraws += 1;
      updatedTeamScores[awayTeamId].totalPoints += 1;
    }

    return updatedTeamScores;
  };

  calculateBalanceAndEfficiency = (teamScores: ITeamScores): ITeamScoresFinal[] => {
    const leaderboard: ITeamScoresFinal[] = Object.keys(teamScores).map((teamId) => {
      const team = teamScores[teamId];
      team.goalsBalance = team.goalsFavor - team.goalsOwn;
      team.efficiency = (team.totalPoints / (team.totalGames * 3)) * 100;
      return { id: parseInt(teamId, 10), ...team };
    });

    return leaderboard;
  };

  public async getAllLeaderboards(): Promise<ServiceResponse<ITeamScoresFinal[]>> {
    const teamScores: ITeamScores = await this.initializateLeaderboards();
    const matches = (await this.matchModel.findAll()).filter((match) => !match.inProgress);

    let updatedTeamScores = { ...teamScores };

    matches.forEach((match) => {
      updatedTeamScores = this.updateGoals(match, updatedTeamScores);
      updatedTeamScores = this.updateVictoriesAndPoints(match, updatedTeamScores);
    });

    const teamScoresUpdateBalanceAndEfficiency = this.calculateBalanceAndEfficiency(
      updatedTeamScores,
    );

    return { status: 'SUCCESSFUL', data: teamScoresUpdateBalanceAndEfficiency };
  }
}
