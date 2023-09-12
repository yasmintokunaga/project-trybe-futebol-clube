import { Request, Router, Response } from 'express';
import UserController from '../database/controllers/UserController';
import ValidationFieldsLogin from '../database/middlewares/ValidationFieldsLogin';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  ValidationFieldsLogin.validateFields,
  (req: Request, res: Response) => userController.loginUser(req, res),
);

export default router;
