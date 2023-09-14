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

  public async getMatchesByInProgress(bool: boolean): Promise<ServiceResponse<IMatch[]>> {
    const matches = (await this.matchModel.findAll()).filter((match) => match.inProgress === bool);
    return { status: 'SUCCESSFUL', data: matches };
  }
}
