import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./user";

class Kyc extends Model {
  public id!: number;
  public userId!: number;
  public walletAddress!: string;
  public status!: "pending" | "approved" | "rejected";
  public fullName!: string;
  public idNumber!: string;
  public address!: string;
  public idDocument!: string;
  public selfie!: string;
  public additionalInfo?: string;
}

Kyc.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
    walletAddress: { type: DataTypes.STRING(42), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "approved", "rejected"), allowNull: false, defaultValue: "pending" },
    fullName: { type: DataTypes.STRING, allowNull: false },
    idNumber: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    idDocument: { type: DataTypes.STRING, allowNull: false },
    selfie: { type: DataTypes.STRING, allowNull: false },
    additionalInfo: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: "kyc_requests",
    timestamps: true,
  }
);

export default Kyc;