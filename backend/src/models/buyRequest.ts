import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class BuyRequest extends Model {
  public id!: number;
  public buyerId!: number;
  public projectId!: number;
  public amount!: number;
  public totalCost!: number;
  public status!: "pending" | "approved" | "rejected";
}

BuyRequest.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    buyerId: { type: DataTypes.INTEGER, allowNull: false },
    projectId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false }, // Credits requested
    totalCost: { type: DataTypes.FLOAT, allowNull: false }, // Total price (amount * price per credit)
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, tableName: "buy_requests", timestamps: true }
);

export default BuyRequest;