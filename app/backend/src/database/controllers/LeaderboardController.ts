import { Request, Response } from 'express';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';

export default class LeaderboardController {
  constructor(
    private leaderboardService = new LeaderboardService(),
  ) { }

  public async getAllLeaderboards(req: Request, res: Response) {
    const serviceResponse = await this.leaderboardService.getAllLeaderboards();
    res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }
}
