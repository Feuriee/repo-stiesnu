"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect all user routes with Admin middleware
router.use(auth_1.authMiddleware, auth_1.adminMiddleware);
router.get('/', user_1.getUsers);
router.post('/', user_1.createUser);
router.put('/:id', user_1.updateUser);
router.patch('/:id/approve', user_1.updateUser); // Added dedicated approval alias
router.delete('/:id', user_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map