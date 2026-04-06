import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/user';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Authentication required for all user routes
router.use(authMiddleware);

router.get('/', adminMiddleware, getUsers);
router.post('/', adminMiddleware, createUser);
router.put('/:id', updateUser); // Both Admin and User (self) handled in controller
router.patch('/:id/approve', adminMiddleware, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);

export default router;
