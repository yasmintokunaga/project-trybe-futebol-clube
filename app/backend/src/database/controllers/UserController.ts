import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import UserService from '../services/UserService';
import Validations from '../middlewares/Validations';
import IUser from '../../Interfaces/IUser';

const secret = process.env.JWT_SECRET || 'jwt_secret';

export default class UserController {
  constructor(
    private userService = new UserService(),
    private validations = new Validations(),
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
    const responseValidation = await this.validations.validateToken(authorizationHeader);
    console.log('RESPONSEVALIDATION:', responseValidation);
    if (responseValidation.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(responseValidation.status)).json(responseValidation.data);
    }

    const { role } = responseValidation.data as IUser;
    res.status(200).json({ role });
  }
}
