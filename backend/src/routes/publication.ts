import { Router } from 'express';
import { getPublications, getPublicationById, createPublication, updatePublication, approvePublication, deletePublication, upload } from '../controllers/publication';
import { authMiddleware, adminMiddleware, nonGuestMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// Publicly accessible if approved, but populates req.user if logged in
router.get('/', optionalAuthMiddleware, getPublications);
router.get('/:id', optionalAuthMiddleware, getPublicationById);

// Requires login (non-guest) to upload
router.post('/', authMiddleware, nonGuestMiddleware, upload.single('pdf'), createPublication);

// Requires login to delete own publication
router.delete('/:id', authMiddleware, deletePublication);

// Requires login to edit publication
router.put('/:id', authMiddleware, upload.single('file'), updatePublication);

// Requires Admin to approve
router.patch('/:id/approve', authMiddleware, adminMiddleware, approvePublication);

export default router;
