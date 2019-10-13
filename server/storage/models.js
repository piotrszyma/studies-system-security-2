const { Sequelize, Model, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:');
const uuidv4 = require('uuid/v4');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Session extends Model { }

Session.init({
  token: { type: DataTypes.UUIDV4, allowNull: false, defaultValue: uuidv4 },
  params: { type: DataTypes.JSON, allowNull: false, defaultValue: {} }
}, { sequelize, modelName: 'session' });

Session.sync({ force: true });

module.exports = {
  Session
}