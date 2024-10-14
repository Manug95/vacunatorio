import { DataTypes, Model }from "sequelize";
import { sequelize } from "../../sequelize.js";

class Paciente extends Model { }

Paciente.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dni: {
    type: DataTypes.STRING(9),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "El DNI es requerido"
      },
      isNumeric: {
        msg: "El DNI debe estar compuesto sólo de números"
      },
      len: {
        msg: "El DNI debe tener 8 números",
        args: [8, 8]
      }
    }
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "El mail es requerido"
      },
      isEmail: {
        msg: "El mail tiene un formato NO válido"
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El teléfono es requerido"
      },
      isNumeric: {
        msg: "El teléfono debe estar compuesto sólo de números"
      },
      len: {
        args: [10, 10],
        msg: "El teléfono es un número de 10 dígitos"
      }
    }
  },
  fechaNac: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: "La fecha de nacimiento tiene un formato incorrecto",
        args: true
      },
      notNull: {
        msg: "La fecha de nacimiento es requerida"
      }
    }
  },
  genero: {
    type: DataTypes.ENUM("Femenino", "Masculino"),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Se debe especificar el género de la persona"
      },
      isIn: {
        msg: "El genero ingresado no es correcto",
        args: [["Femenino", "Masculino"]]
      }
    }
  }
}, {
  sequelize,
  modelName: "Paciente",
  tableName: "pacientes",
  timestamps: false,
  freezeTableName: true
});

export { Paciente };