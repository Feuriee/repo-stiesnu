"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publication_1 = require("../controllers/publication");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Publicly accessible if approved
router.get('/', publication_1.getPublications);
router.get('/:id', publication_1.getPublicationById);
// Requires login (non-guest) to upload
router.post('/', auth_1.authMiddleware, auth_1.nonGuestMiddleware, publication_1.upload.single('pdf'), publication_1.createPublication);
// Requires login to delete own publication
router.delete('/:id', auth_1.authMiddleware, publication_1.deletePublication);
// Requires login to edit publication
router.put('/:id', auth_1.authMiddleware, publication_1.upload.single('file'), publication_1.updatePublication);
// Requires Admin to approve
router.patch('/:id/approve', auth_1.authMiddleware, auth_1.adminMiddleware, publication_1.approvePublication);
exports.default = router;
//# sourceMappingURL=publication.js.map