import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';

import { Response } from 'superagent';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { team, teams } from './Team.mocks';

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