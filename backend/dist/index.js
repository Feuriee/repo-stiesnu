"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 8000;
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Vue default port
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const publication_1 = __importDefault(require("./routes/publication"));
const publication_2 = require("./controllers/publication");
// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
// Static files (PDFs)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/publications', publication_1.default);
// Dedicated standalone PDF upload
app.post('/api/upload', publication_2.upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map