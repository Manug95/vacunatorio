import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Descarte extends Model { }

Descarte.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de descarte no es una fecha"
      },
      notNull: {
        msg: "La fecha de descarte es requerida"
      }
    }
  },
  motivo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: "El motivo del descarte es requerido"
      },
      len: {
        args: [1,100],
        msg: "La descripción del motivo del descarte debe tener entre 1 y 100 caracteres"
      }
    }
  },
  formaDescarte: {
    type: DataTypes.ENUM(),
    values: ["INCINERACION", "OTRO"],
    allowNull: false,
    validate: {
      notNull: {
        msg: "La forma de descarte es requerida"
      },
      notEmpty: {
        msg: "La forma de descarte es requerida"
      },
      isIn: {
        args: [["INCINERACION", "OTRO"]],
        msg: "El dato ingresado no corresponde a una forma de descarte válida"
      }
    }
  }
}, {
  sequelize,
  modelName: "Descarte",
  tableName: "descartes",
  timestamps: false,
  freezeTableName: true
});

export { Descarte };