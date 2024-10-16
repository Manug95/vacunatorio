import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class SolicitudSublote extends Model { }

SolicitudSublote.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      isInt: {
        msg: "El numero ingresado en la cantidad de vacunas no un número entero"
      },
      notNull: {
        msg: "La cantidad de vacunas es requerida"
      },
      min: {
        args: [0],
        msg: "La cantidad no puede ser negativa"
      }
    }
  },
  fechaSolicitud: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de solicitud no es una fecha"
      },
      notNull: {
        msg: "La fecha de solicitud es requerida"
      }
    }
  },
  estado: {
    type: DataTypes.ENUM,
    values: ['COMPRADA', 'PENDIENTE', 'RECHAZADA'],
    allowNull: false,
    validate: {
      isUppercase: {
        msg: "El estado debe estar en mmayúsculas"
      },
      isIn: {
        args: [['COMPRADA', 'PENDIENTE', 'RECHAZADA']],
        msg: "El dato ingresado no corresponde a una forma de descarte válida"
      },
      notNull: {
        msg: "El estado de la solicitud es requerido"
      },
      notEmpty: {
        msg: "El estado de la solicitud es requerido"
      }
    }
  }
}, {
  sequelize,
  modelName: "SolicitudSublote",
  tableName: "solicitudes-sublotes",
  timestamps: false,
  freezeTableName: true
});

export { SolicitudSublote };