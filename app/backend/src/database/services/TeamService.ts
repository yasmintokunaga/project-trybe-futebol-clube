import { NewEntity } from '../../Interfaces';
import { ITeamModel } from '../../Interfaces/ITeamModel';
import TeamModel from '../models/TeamModel';
import ITeam from '../../Interfaces/ITeam';
import { ServiceResponse } from '../../Interfaces/ServiceResponse';

export default class TeamService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
  ) { }

  public async createTeam(book: NewEntity<ITeam>): Promise<ServiceResponse<ITeam>> {
    const newBook = await this.teamModel.create(book);
    return { status: 'SUCCESSFUL', data: newBook };
  }

  public async getAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const allTeams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: allTeams };
  }

  public async getTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findById(id);
    if (!team) return { status: 'NOT_FOUND', data: { message: `Team ${id} not found` } };
    return { status: 'SUCCESSFUL', data: team };
  }
}
