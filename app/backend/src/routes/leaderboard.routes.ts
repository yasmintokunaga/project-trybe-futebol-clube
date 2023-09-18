import { Request, Router, Response } from 'express';
import LeaderboardController from '../database/controllers/LeaderboardController';

const leaderboardController = new LeaderboardController();

const router = Router();

router.get(
  '/home',
  (req: Request, res: Response) => leaderboardController.getAllLeaderboardsHomeTeam(req, res),
);

router.get(
  '/away',
  (req: Request, res: Response) => leaderboardController.getAllLeaderboardsAwayTeam(req, res),
);

export default router;
