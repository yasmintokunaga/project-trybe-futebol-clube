import { Request, Router, Response } from 'express';
import UserController from '../database/controllers/UserController';
import Validations from '../database/middlewares/Validations';

const userController = new UserController();

const router = Router();

router.post(
  '/',
  Validations.validateFields,
  Validations.validateEmailPassword,
  (req: Request, res: Response) => userController.loginUser(req, res),
);

router.get(
  '/role',
  (req: Request, res: Response) => userController.getRoleByToken(req, res),
);

export default router;
