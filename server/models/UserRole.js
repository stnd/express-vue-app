import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserRole = sequelize.define(
  "UserRole",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Roles",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default UserRole;
