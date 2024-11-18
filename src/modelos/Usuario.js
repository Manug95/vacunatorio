import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Usuario extends Model { }

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 60]
    }
  },
  rol: {
    type: DataTypes.ENUM,
    values: ['A', 'B', 'C'],
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['A', 'B', 'C']]
    }
  }
}, {
  sequelize,
  modelName: "Usuario",
  tableName: "usuarios",
  timestamps: false,
  freezeTableName: true
});

export { Usuario };