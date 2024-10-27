import sequelize from './sequelize';
import User from '../models/User'; // Ensure the paths are correct

const syncDatabase = async (): Promise<void> => { // Explicitly type the return value
  try {
    await sequelize.sync({ force: false }); // Be cautious with `force: true`
    console.log('Database synchronized successfully.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error synchronizing the database:', error.message);
    } else {
      console.error('Unknown error synchronizing the database:', error);
    }
  }
};

export default syncDatabase;
