import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class SubLote extends Model { }

SubLote.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  cantidad: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    validate: {
      isInt: {
        msg: "El numero ingresado en la cantidad de vacunas del sublote no un número entero"
      },
      notNull: {
        msg: "La cantidad de vacunas del sublote es requerida"
      },
      min: {
        args: [0],
        msg: "La cantidad no puede ser negativa"
      }
    }
  }
}, {
  sequelize,
  modelName: "SubLote",
  tableName: "sublotes",
  timestamps: false,
  freezeTableName: true
});

export { SubLote };