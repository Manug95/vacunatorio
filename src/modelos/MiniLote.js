import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class MiniLote extends Model { }

MiniLote.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
}, {
  sequelize,
  modelName: "MiniLote",
  tableName: "minilotes",
  timestamps: false,
  freezeTableName: true
});

export { MiniLote };