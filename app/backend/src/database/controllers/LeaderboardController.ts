import { Request, Response } from 'express';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) { }

  public async getAllLeaderboardsHomeTeam(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getAllLeaderboards('homeTeam');
    res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  public async getAllLeaderboardsAwayTeam(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getAllLeaderboards('awayTeam');
    res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
