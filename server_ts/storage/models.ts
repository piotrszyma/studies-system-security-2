import { Sequelize, Model, DataTypes } from 'sequelize';
import uuidv4 from 'uuid/v4';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export class Session extends Model {
  public token!: string;
  public params!: Object;
}

Session.init({
  token: { type: DataTypes.UUIDV4, allowNull: false, defaultValue: uuidv4 },
  params: { type: DataTypes.JSON, allowNull: false, defaultValue: {} }
}, { sequelize, modelName: 'session' });

Session.sync({ force: true });
