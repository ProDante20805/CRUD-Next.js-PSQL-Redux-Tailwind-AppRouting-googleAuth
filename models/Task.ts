import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../lib/sequelize';

// Define the Task model with TypeScript using inferred attributes
class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  // Specify the model properties with TypeScript types
  declare id: CreationOptional<number>; // 'id' is optional for creation
  declare title: string;  // 'title' is required
}

// Initialize the model with TypeScript configurations
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,  // Pass the sequelize instance
    modelName: 'Task',  // Model title
    tableName: 'tasks',  // Table title in DB
    timestamps: false
  }
);

export default Task;
