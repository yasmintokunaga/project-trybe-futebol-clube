import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import TeamService from '../services/TeamService';

const secret = process.env.JWT_SECRET || 'jwt_secret';

type JwtPayload = {
  data: { id: number };
};

class Validations {
  constructor(
    private userService = new UserService(),
    private teamService = new TeamService(),

  ) { }

  static validateFields(req: Request, res: Response, next: NextFunction): Response | void {
    const login = req.body;
    const isAllFieldsFilled = login.email && login.password;
    if (!isAllFieldsFilled) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }

  static validateEmailPassword(req: Request, res: Response, next: NextFunction): Response | void {
    const { email, password } = req.body;
    const userEmail = email.split('@')[0];
    const domainEmail = email.split('@')[1];
    const isEmailValid = userEmail && userEmail.length >= 1
      && domainEmail && domainEmail.length > 4 && domainEmail.includes('.com');
    const isPasswordValid = password.length >= 6;
    if (!isEmailValid || !isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next();
  }

  public validateToken = async (authorizationHeader: string | undefined) => {
    if (!authorizationHeader) {
      return { status: 'INVALID_DATA', data: { message: 'Token not found' } };
    }

    const token = authorizationHeader.includes('Bearer')
      ? authorizationHeader.split(' ')[1] : authorizationHeader;
    if (token.split('.').length !== 3) {
      return { status: 'INVALID_DATA', data: { message: 'Token must be a valid token' } };
    }

    const { data } = jwt.verify(token, secret) as JwtPayload;

    const serviceResponse = await this.userService.getUserById(data.id);

    if (serviceResponse.status !== 'SUCCESSFUL') {
      return { status: 'INVALID_DATA', data: { message: 'Token must be a valid token' } };
    }

    return serviceResponse;
  };
}

export default Validations;
