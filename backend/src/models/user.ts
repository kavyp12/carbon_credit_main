import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public companyName!: string;
  public userType!: "buyer" | "seller";
  public agreeTerms!: boolean;
  public bio!: string;
  public phone!: string;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.ENUM("buyer", "seller"),
      allowNull: false,
    },
    agreeTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    bio: { type: DataTypes.TEXT, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    
  }, 
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

export default User;