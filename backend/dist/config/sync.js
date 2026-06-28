"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const syncDatabase = async () => {
    try {
        await database_1.default.authenticate();
        console.log('Database connection established successfully.');
        // Sync all models
        await database_1.default.sync({ alter: true });
        console.log('All models synchronized successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Unable to connect to database:', error);
        process.exit(1);
    }
};
syncDatabase();
//# sourceMappingURL=sync.js.map