import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";
import { CentroVacunacion } from "./relaciones.js";

class DistribucionProvincial extends Model { }

DistribucionProvincial.init({
  fechaSalida: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: true
    }
  },
  fechaLlegada: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW, // esto despues se borra (hacer.txt)
    allowNull: false,
    validate: {
      isDate: true,
      notNull: true
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
      isNumeric: true,
      isInt: true,
      notNull: true,
      min: 1
    }
  }
}, {
  sequelize,
  modelName: "DistribucionProvincial",
  tableName: "distribucion-provincial",
  timestamps: false,
  freezeTableName: true
});

export { DistribucionProvincial };