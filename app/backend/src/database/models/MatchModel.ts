import { IMatchModel } from '../../Interfaces/IMatchModel';
import SequelizeMatch from './SequelizeMatch';
import IMatch from '../../Interfaces/IMatch';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;

  async findAll(): Promise<IMatch[]> {
    const dbData = await this.model.findAll();
    return dbData.map((
      { id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress },
    ) => ({ id, homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals, inProgress }));
  }
}
