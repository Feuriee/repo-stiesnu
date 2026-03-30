"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isApproved: true,
                createdAt: true,
                _count: {
                    select: { publications: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
// Create user (Admin only)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, isApproved } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'GUEST',
                isApproved: isApproved || false
            },
            select: { id: true, name: true, email: true, role: true }
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
// Update user details or approval status (Admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isApproved, password } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = String(name);
        if (email !== undefined)
            updateData.email = String(email);
        if (role !== undefined)
            updateData.role = String(role);
        if (isApproved !== undefined)
            updateData.isApproved = isApproved;
        if (password) {
            updateData.password = await bcryptjs_1.default.hash(String(password), 10);
        }
        const user = await prisma.user.update({
            where: { id: String(id) },
            data: updateData,
            select: { id: true, name: true, email: true, role: true, isApproved: true }
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};
exports.updateUser = updateUser;
// Delete user (Admin)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: String(id) } });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map