import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Personal extends Model { }

Personal.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombres: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El nombre es requerido"
      },
      len: {
        msg: "El nombre debe tener entre 1 y 50 caracteres",
        args: [1, 50]
      }
    }
  },
  apellidos: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El apellido es requerido"
      },
      len: {
        msg: "El apellido debe tener entre 1 y 50 caracteres",
        args: [1, 50]
      }
    }
  },
  cargo: {
    type: DataTypes.ENUM,
    values: ['ADMINISTRATIVO', 'LOGISTICA', 'ENFERMERO'],
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El cargo es requerido"
      },
      isIn: {
        msg: "El cargo ingresado no es un cargo válido",
        args: [['ADMINISTRATIVO', 'LOGISTICA', 'ENFERMERO']]
      }
    }
  },
  codigo: {
    type: DataTypes.STRING(6),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "El código es requerido"
      },
      len: {
        msg: "Longitud del código incorrecta",
        args: [6, 6]
      },
      // isNumeric: {
      //   msg: "El código debe estar compuesto sólo de números"
      // }
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Personal",
  tableName: "personal",
  timestamps: false,
  freezeTableName: true
});

export { Personal };