import { NextFunction, Request, Response } from 'express';

class ValidationFieldsLogin {
  static validateFields(req: Request, res: Response, next: NextFunction): Response | void {
    const login = req.body;
    const isAllFieldsFilled = login.email && login.password;
    if (!isAllFieldsFilled) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    next();
  }
}

export default ValidationFieldsLogin;
