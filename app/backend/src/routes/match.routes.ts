import { Request, Router, Response } from 'express';
import MatchController from '../database/controllers/MatchController';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => matchController.getAllMatches(req, res));
router.patch('/:id/finish', (req: Request, res: Response) => matchController.finishMatch(req, res));
router.patch('/:id', (req: Request, res: Response) => matchController.updateMatchFields(req, res));

export default router;
