import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Project extends Model {
  public id!: string;
  public userId!: string;
  public title!: string;
  public type!: string;
  public location!: string;
  public price!: number;
  public amount!: number;
  public amountAvailable!: number;
  public description!: string | null;
  public documents!: string[];
  public status!: "pending" | "reviewing" | "approved" | "rejected" | "draft";
  public adminNotes?: string;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amountAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "reviewing", "approved", "rejected", "draft"),
      defaultValue: "pending",
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Project",
  }
);

export default Project;