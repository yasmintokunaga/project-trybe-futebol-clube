import { ServiceResponse } from '../../Interfaces/ServiceResponse';
import { IUserModel } from '../../Interfaces/IUserModel';
import UserModel from '../models/UserModel';
import IUser from '../../Interfaces/IUser';

export default class UserService {
  constructor(
    private userModel: IUserModel = new UserModel(),
  ) { }

  public async getUserByEmail(email: string): Promise<ServiceResponse<IUser>> {
    const user = await this.userModel.findByEmail(email);
    if (!user) return { status: 'INVALID_DATA', data: { message: `User ${email} not found` } };
    return { status: 'SUCCESSFUL', data: user };
  }

  public async getUserById(id: number): Promise<ServiceResponse<IUser>> {
    const user = await this.userModel.findById(id);
    if (!user) return { status: 'INVALID_DATA', data: { message: `User ${id} not found` } };
    return { status: 'SUCCESSFUL', data: user };
  }
}
