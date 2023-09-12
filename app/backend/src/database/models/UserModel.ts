import { NewEntity } from '../../Interfaces';
import { IUserModel } from '../../Interfaces/IUserModel';
import SequelizeUser from './SequelizeUser';
import IUser from '../../Interfaces/IUser';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async create(data: NewEntity<IUser>): Promise<IUser> {
    const dbData = await this.model.create(data);

    const { id, username, role, email, password }: IUser = dbData;
    return { id, username, role, email, password };
  }

  async findAll(): Promise<IUser[]> {
    const dbData = await this.model.findAll();
    return dbData.map(({ id, username, role, email, password }) => (
      { id, username, role, email, password }
    ));
  }

  async findById(id: IUser['id']): Promise<IUser | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData == null) return null;

    const { username, role, email, password }: IUser = dbData;
    return { id, username, role, email, password };
  }
}
