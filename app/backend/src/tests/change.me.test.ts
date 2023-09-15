import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { team, teams } from './Team.mocks';
import SequelizeUser from '../database/models/SequelizeUser';
import { user, userLogin } from './User.mocks';
import SequelizeMatch from '../database/models/SequelizeMatch';
import { matches, newMatch } from './Match.mocks';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams Test', function() {
  xit('should create a team', async function() {
    sinon.stub(SequelizeTeam, 'create').resolves(team as any);

    const { id, ...teamName } = team;

    const { status, body } = await chai.request(app).post('/teams')
      .send(teamName);

    expect(status).to.equal(201);
    expect(body).to.deep.equal(team);
  });

  xit('shouldn\'t create a team with invalid body data', async function() {
    const { status, body } = await chai.request(app).post('/teams')
      .send({});

    expect(status).to.equal(400);
    expect(body.message).to.equal('team name is required');
  });

  it('should return all teams', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('should return a team by id', async function() {
    sinon.stub(SequelizeTeam, 'findOne').resolves(team as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team);
  });

  it('should return not found if the team doesn\'t exists', async function() {
    sinon.stub(SequelizeTeam, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team 1 not found');
  });

  afterEach(sinon.restore);
});

describe('User and Login Test', function() {
  it('should do login and return the valid token', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const { status, body } = await chai.request(app).post('/login')
      .send(userLogin);
    
    expect(status).to.equal(200);
    expect(body.token).to.be.a.string;
    expect(body.token.split('.')).to.have.length(3);
  });

  it('shouldn\'t do login without email', async function() {
    const invalidLogin = { password: user.password }

    const { status, body } = await chai.request(app).post('/login')
      .send(invalidLogin);
    
    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('shouldn\'t do login without password', async function() {
    const invalidLogin = { email: user.email }

    const { status, body } = await chai.request(app).post('/login')
      .send(invalidLogin);
    
    expect(status).to.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('shouldn\'t do login with invalid email', async function() {
    const invalidLogin = { ...user, email: 'teste.teste' };

    const { status, body } = await chai.request(app).post('/login')
      .send(invalidLogin);
    
    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('shouldn\'t do login with email not registered', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).post('/login')
      .send({ ...userLogin, email: 'teste@teste.com' });
    
    expect(status).to.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  afterEach(sinon.restore);
});

describe('Match Test', function() {
  it('should get all matches', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches');
    
    expect(status).to.equal(200);
    expect(body).to.be.deep.equal(matches);

  });

  it('should filter matches inProgress = true', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    const matchesInProgressTrue = matches.filter((matches) => matches.in_progress);
    
    expect(status).to.equal(200);
    expect(body).to.be.deep.equal(matchesInProgressTrue);
  });

  it('should filter matches inProgress = false', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=false');

    const matchesInProgressFalse = matches.filter((matches) => matches.in_progress === 1);
    
    expect(status).to.equal(200);
    expect(body).to.be.deep.equal(matchesInProgressFalse);
  });

  it('should finish a match', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    const match = matches.find((match) => match.id === 1);
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);

    const responseLogin = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai.request(app).patch('/matches/1/finish')
      .set('authorization', `Bearer ${responseLogin.body.token}`);
    
    expect(status).to.equal(200);
    expect(body).to.be.deep.equal({ message: 'Finished' });
  });

  it('should update match', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
  
    const match = matches.find((match) => match.id === 1);
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);

    const responseLogin = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai.request(app).patch('/matches/1')
      .set('authorization', `Bearer ${responseLogin.body.token}`);
    
    expect(status).to.equal(200);
    expect(body).to.be.deep.equal({ message: 'Updated' });
  });

  it('should create a new match', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
  
    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves({ id: 12, teamName: 'firstTeam' } as any)
      .onSecondCall().resolves({ id: 8, teamName: 'secondTeam' } as any);

    sinon.stub(SequelizeMatch, 'create').resolves(newMatch as any);

    const sendMatch = {
      homeTeamId: 12,
      homeTeamGoals: 4,
      awayTeamId: 8,
      awayTeamGoals: 1,
    };

    const responseLogin = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendMatch);
    
    expect(status).to.equal(201);
    expect(body).to.be.deep.equal(newMatch);
  });

  it('should not create a new match if homeTeam is equal awayTeam', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const sendMatch = {
      homeTeamId: 12,
      homeTeamGoals: 4,
      awayTeamId: 12,
      awayTeamGoals: 1,
    };

    const responseLogin = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendMatch);
    
    expect(status).to.equal(422);
    expect(body).to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
  });

  it('should not create a new match if some team does not exist', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(user as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
  
    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves(null)
      .onSecondCall().resolves({ id: 8, teamName: 'secondTeam' } as any);

    const sendMatch = {
      homeTeamId: 12,
      homeTeamGoals: 4,
      awayTeamId: 8,
      awayTeamGoals: 1,
    };

    const responseLogin = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendMatch);
    
    expect(status).to.equal(404);
    expect(body).to.be.deep.equal({ message: 'There is no team with such id!' });
  });

  afterEach(sinon.restore);
});