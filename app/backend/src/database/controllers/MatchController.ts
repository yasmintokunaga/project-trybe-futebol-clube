import { Request, Response } from 'express';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';
import Validations from '../middlewares/Validations';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
    private validations = new Validations(),
  ) { }

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress) {
      const inProgressValue = inProgress === 'true';
      const serviceResponse = await this.matchService.getMatchesByInProgress(inProgressValue);
      return res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
    }
    const serviceResponse = await this.matchService.getAllMatches();
    res.status(mapStatusHTTP(serviceResponse.status)).json(serviceResponse.data);
  }

  public async finishMatch(req: Request, res: Response) {
    const authorizationHeader = req.header('authorization');
    const responseValidation = await this.validations.validateToken(authorizationHeader);
    if (responseValidation.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(responseValidation.status)).json(responseValidation.data);
    }

    const { id } = req.params;
    await this.matchService.finishMatch(parseInt(id, 10));
    return res.status(200).json({ message: 'Finished' });
  }

  public async updateMatchFields(req: Request, res: Response) {
    const authorizationHeader = req.header('authorization');
    const responseValidation = await this.validations.validateToken(authorizationHeader);
    if (responseValidation.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(responseValidation.status)).json(responseValidation.data);
    }

    const updateFields = req.body;
    const { id } = req.params;

    await this.matchService.updateMatchFields(parseInt(id, 10), updateFields);
    return res.status(200).json({ message: 'Updated' });
  }

  public async createMatch(req: Request, res: Response) {
    const authorizationHeader = req.header('authorization');
    const responseValidation = await this.validations.validateToken(authorizationHeader);
    if (responseValidation.status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(responseValidation.status)).json(responseValidation.data);
    }

    const serviceResponse = await this.matchService.createMatch(req.body);
    res.status(201).json(serviceResponse.data);
  }
}
