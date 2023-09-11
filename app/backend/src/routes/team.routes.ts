import { Request, Router, Response } from 'express';
import TeamController from '../database/controllers/TeamController';

const teamController = new TeamController();

const router = Router();

router.post('/', (req: Request, res: Response) => teamController.createTeam(req, res));

router.get('/', (req: Request, res: Response) => teamController.getAllTeams(req, res));
router.get('/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));

export default router;
