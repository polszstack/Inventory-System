import sequelize from './database';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models synchronized successfully.');
    
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

syncDatabase();