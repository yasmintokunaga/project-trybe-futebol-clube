import { Model, QueryInterface, DataTypes } from 'sequelize';
import IMatch from '../../Interfaces/IMatch';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<IMatch>>('matches', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      homeTeamId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'home_team_id',
      },
      homeTeamGoals: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'home_team_goals',
      },      
      awayTeamId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'away_team_id',
      },      
      awayTeamGoals: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'away_team_goals',
      },      
      inProgress: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'in_progress',
      },
    });
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('matches');
  },
};