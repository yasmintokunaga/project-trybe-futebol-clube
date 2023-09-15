import { Request, Response } from 'express';
import mapStatusHTTP from '../../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';
import Validations from '../middlewares/Validations';
import TeamService from '../services/TeamService';

export default class MatchController {
  constructor(
    private matchService = new MatchService(),
    private validations = new Validations(),
    private teamService = new TeamService(),
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
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const isHomeTeamExist = await this.teamService.getTeamById(homeTeamId);
    const isAwayTeamExist = await this.teamService.getTeamById(awayTeamId);

    if (isHomeTeamExist.status === 'NOT_FOUND' || isAwayTeamExist.status === 'NOT_FOUND') {
      return res.status(mapStatusHTTP('NOT_FOUND'))
        .json({ message: 'There is no team with such id!' });
    }
    const serviceResponse = await this.matchService.createMatch(req.body);
    res.status(201).json(serviceResponse.data);
  }
}
