import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('vacunatorio', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  define: {
    freezeTableName: true
  },
  logging: false
});