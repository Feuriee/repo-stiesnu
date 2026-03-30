import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Protect all user routes with Admin middleware
router.use(authMiddleware, adminMiddleware);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.patch('/:id/approve', updateUser); // Added dedicated approval alias
router.delete('/:id', deleteUser);

export default router;
