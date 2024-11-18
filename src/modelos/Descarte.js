import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";
import { motivosDescarte, formasDescarte } from "../../utils.js";

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
    type: DataTypes.ENUM(),
    // values: ["VENCIMIENTO", "ROTURA", "PERDIDA DE FRIO"],
    values: motivosDescarte,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El motivo del descarte es requerido"
      },
      notEmpty: {
        msg: "El motivo del descarte es requerido"
      },
      isIn: {
        // args: [["VENCIMIENTO", "ROTURA", "PERDIDA DE FRIO"]],
        args: [motivosDescarte],
        msg: "El dato ingresado no corresponde a un motivo de descarte válido"
      }
    }
  },
  formaDescarte: {
    type: DataTypes.ENUM(),
    // values: ["INCINERACION", "OTRO"],
    values: formasDescarte,
    allowNull: false,
    validate: {
      notNull: {
        msg: "La forma de descarte es requerida"
      },
      notEmpty: {
        msg: "La forma de descarte es requerida"
      },
      isIn: {
        // args: [["INCINERACION", "OTRO"]],
        args: [formasDescarte],
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