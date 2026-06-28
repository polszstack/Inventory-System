"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim()),
    },
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static files
app.use('/uploads', express_1.default.static('uploads'));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    });
});
// API Routes
app.use('/api', routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});
// Global error handler
app.use(errorHandler_1.ErrorHandler.handle);
// Database connection and server start
const startServer = async () => {
    try {
        await database_1.default.authenticate();
        logger_1.default.info('✅ Database connection established successfully.');
        // Sync database in development
        if (process.env.NODE_ENV === 'development') {
            await database_1.default.sync({ alter: true });
            logger_1.default.info('✅ Database models synchronized.');
        }
        app.listen(PORT, () => {
            logger_1.default.info(`✅ Server running on port ${PORT}`);
            logger_1.default.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger_1.default.info(`🌐 Health check: http://localhost:${PORT}/health`);
            logger_1.default.info(`📚 API Base URL: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        logger_1.default.error('❌ Unable to start server:', error);
        process.exit(1);
    }
};
// Error handlers
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map