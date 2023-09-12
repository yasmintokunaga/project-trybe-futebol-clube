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
}

export default ValidationFieldsLogin;
