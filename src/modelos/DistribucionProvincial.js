import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";
import { CentroVacunacion } from "./relaciones.js";

class DistribucionProvincial extends Model { }

DistribucionProvincial.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fechaSalida: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de salida no es una fecha"
      },
      notNull: {
        msg: "La fecha de salida es requerida"
      }
    }
  },
  fechaLlegada: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW, // esto despues se borra (hacer.txt)
    allowNull: false,
    validate: {
      isDate: {
        args: true,
        msg: "La fecha de llegada no es una fecha"
      },
      notNull: {
        msg: "La fecha de llegada es requerida"
      }
    }
  },
  redistribuidoPor: {
    type: DataTypes.INTEGER,
    references: {
      model: CentroVacunacion,
      key: "id"
    }
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
  }
}, {
  sequelize,
  modelName: "DistribucionProvincial",
  tableName: "distribuciones_provinciales",
  timestamps: false,
  freezeTableName: true
});

export { DistribucionProvincial };