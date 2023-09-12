import IUser from './IUser';

export interface IUserModel {
  create(data: Partial<IUser>): Promise<IUser>,
  findAll(): Promise<IUser[]>,
  findById(id: IUser['id']): Promise<IUser | null>,
  findByEmail(email: IUser['email']): Promise<IUser | null>,
}
