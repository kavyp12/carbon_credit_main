import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("projects", "userId", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.changeColumn("projects", "userId", {
      type: DataTypes.STRING(255),
      allowNull: false,
    });
  },
};