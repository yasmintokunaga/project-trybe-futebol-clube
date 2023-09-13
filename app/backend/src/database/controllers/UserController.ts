import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import UserService from '../services/UserService';

const secret = process.env.JWT_SECRET || 'jwt_secret';

type JwtPayload = {
  data: { id: number };
};

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

    const token = jwt.sign({ data: { id: data.id } }, secret);
    res.status(200).json({ token });
  }

  public async getRoleByToken(req: Request, res: Response) {
    const authorizationHeader = req.header('authorization');
    if (!authorizationHeader) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const token = authorizationHeader.includes('Bearer')
      ? authorizationHeader.split(' ')[1] : authorizationHeader;
    if (token.split('.').length !== 3) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    const { data } = jwt.verify(token, secret) as JwtPayload;

    const serviceResponse = await this.userService.getUserById(data.id);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(serviceResponse.status))
        .json({ message: 'Token must be a valid token' });
    }

    const { role } = serviceResponse.data;
    res.status(200).json({ role });
  }
}
