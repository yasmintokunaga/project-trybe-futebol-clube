import IMatch from './IMatch';

export interface IMatchModel {
  createMatch(data: Partial<IMatch>): Promise<IMatch>,
  findAll(): Promise<IMatch[]>,
  findMatchById(id: IMatch['id']): Promise<IMatch | null>,
  finishMatch(id: IMatch['id']): Promise<void>,
  updateMatchFields(id: IMatch['id'], updateFields: Partial<IMatch>): Promise<void>,
}
