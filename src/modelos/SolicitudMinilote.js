import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class SolicitudMinilote extends Model { }

SolicitudMinilote.init({
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
    type: DataTypes.DATEONLY,
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
  }
}, {
  sequelize,
  modelName: "SolicitudMinilote",
  tableName: "solicitudes-minilote",
  timestamps: false,
  freezeTableName: true
});

export { SolicitudMinilote };