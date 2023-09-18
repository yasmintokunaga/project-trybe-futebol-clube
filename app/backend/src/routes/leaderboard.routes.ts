import { Request, Router, Response } from 'express';
import LeaderboardController from '../database/controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getAllLeaderboards(req, res),
);

export default router;
