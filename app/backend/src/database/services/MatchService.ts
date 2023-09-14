import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import MatchModel from '../models/MatchModel';
import IMatch from '../../Interfaces/IMatch';

export default class MatchService {
  constructor(
    private matchModel: IMatchModel = new MatchModel(),
  ) { }

  public async getAllMatches(): Promise<ServiceResponse<IMatch[]>> {
    const matches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async getMatchById(id: IMatch['id']): Promise<ServiceResponse<IMatch>> {
    const match = await this.matchModel.findMatchById(id);
    if (match === null) {
      return { status: 'NOT_FOUND', data: { message: `Match ${id} not found` } };
    }
    return { status: 'SUCCESSFUL', data: match };
  }

  public async getMatchesByInProgress(bool: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = (await this.matchModel.findAll()).filter((match) => match.inProgress === bool);
    return { status: 'SUCCESSFUL', data: matches };
  }

  public async finishMatch(id: IMatch['id']): Promise<void> {
    await this.matchModel.finishMatch(id);
  }

  public async updateMatchFields(id: IMatch['id'], updateFields: Partial<IMatch>): Promise<void> {
    await this.matchModel.updateMatchFields(id, updateFields);
  }
}
