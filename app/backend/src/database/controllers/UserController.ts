import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import UserService from '../services/UserService';

export default class UserController {
  constructor(
    private userService = new UserService(),
  ) { }

  public async loginUser(req: Request, res: Response) {
    const login = req.body;
    const serviceResponse = await this.userService.getUserByEmail(login.email);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status))
        .json({ message: 'Invalid email or password' });
    }

    const { data } = serviceResponse;

    const isPasswordValid = bcrypt.compareSync(login.password, data.password);

    if (!isPasswordValid) {
      return res.status(mapStatusHTTP('INVALID_DATA'))
        .json({ message: 'Invalid email or password' });
    }

    const token = bcrypt.hashSync('bacon');

    res.status(200).json({ token });
  }
}
