import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
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
   } catch (error) {
     res.status(500).json({ error: 'Failed to fetch users' });
   }
};

// Create user (Admin only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
   try {
     const { name, email, password, role, isApproved } = req.body;
     
     const existingUser = await prisma.user.findUnique({ where: { email }});
     if (existingUser) {
        res.status(400).json({ error: 'Email is already registered' });
        return;
     }

     const hashedPassword = await bcrypt.hash(password, 10);
     
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
   } catch (error) {
     res.status(500).json({ error: 'Failed to create user' });
   }
};

// Update user details or approval status (Admin)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     const { name, email, role, isApproved, password } = req.body;
     
     const updateData: any = {};
     if (name !== undefined) updateData.name = String(name);
     if (email !== undefined) updateData.email = String(email);
     if (role !== undefined) updateData.role = String(role);
     if (isApproved !== undefined) updateData.isApproved = isApproved;
     
     if (password) {
        updateData.password = await bcrypt.hash(String(password), 10);
     }
     
     const user = await prisma.user.update({
       where: { id: String(id) },
       data: updateData,
       select: { id: true, name: true, email: true, role: true, isApproved: true }
     });
     
     res.status(200).json(user);
   } catch (error) {
     res.status(500).json({ error: 'Failed to update user' });
   }
};

// Delete user (Admin)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
   try {
     const { id } = req.params;
     
     await prisma.user.delete({ where: { id: String(id) }});
     
     res.status(200).json({ message: 'User deleted successfully' });
   } catch (error) {
     res.status(500).json({ error: 'Failed to delete user' });
   }
};
