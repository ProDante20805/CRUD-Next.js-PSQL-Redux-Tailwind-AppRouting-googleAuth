import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize'; // Adjust the path according to your project structure

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
}

User.init(
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
  }
);

export default User;
