import { NewEntity } from '../../Interfaces';
import { IMatchModel } from '../../Interfaces/IMatchModel';
import SequelizeMatch from './SequelizeMatch';
import IMatch from '../../Interfaces/IMatch';
import SequelizeTeam from './SequelizeTeam';

export default class MatchModel implements IMatchModel {
  private model = SequelizeMatch;

  async findAll(): Promise<IMatch[]> {
    const dbData = await this.model.findAll({
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });

    return dbData;
  }

  async findMatchById(id: IMatch['id']): Promise<IMatch | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;

    return dbData;
  }

  async finishMatch(id: IMatch['id']): Promise<void> {
    const match = await this.model.findByPk(id);
    if (!match) {
      throw new Error('Match not found');
    }
    await this.model.update({ inProgress: false }, { where: { id } });
  }

  async updateMatchFields(id: IMatch['id'], updateFields: Partial<IMatch>): Promise<void> {
    const match = await this.model.findByPk(id);
    if (!match) {
      throw new Error('Match not found');
    }
    await this.model.update(updateFields, { where: { id } });
  }

  async createMatch(data: NewEntity<IMatch>): Promise<IMatch> {
    const dbData = await this.model.create({ ...data, inProgress: true });

    const {
      id,
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress,
    }: IMatch = dbData;
    return {
      id,
      homeTeamId,
      homeTeamGoals,
      awayTeamId,
      awayTeamGoals,
      inProgress,
    };
  }
}
