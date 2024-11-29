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
    type: DataTypes.STRING(16),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El nombre de usuario es requerido"
      },
      len: {
        args: [3, 16],
        msg: "El usuario debe tener entre 3 y 16 caracteres"
      },
      isString(value) {
        if (typeof value !== "string") {
          throw new Error('No es un string');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "La contraseña es requerida"
      },
      len: {
        args: [6, 60],
        msg: "La contraseña debe tener entre 6 y 25 caracteres"
      },
      isString(value) {
        if (typeof value !== "string") {
          throw new Error('No es un string');
        }
      }
    }
  },
  rol: {
    type: DataTypes.ENUM,
    values: ['ADMIN_NAC', 'LOGIST_NAC', 'ENFERMERO', 'ADMIN_PROV', 'LOGIST_PROV', 'ADMIN_CEN', 'LOGIST_CEN'],
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['ADMIN_NAC', 'LOGIST_NAC', 'ENFERMERO', 'ADMIN_PROV', 'LOGIST_PROV', 'ADMIN_CEN', 'LOGIST_CEN']]
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