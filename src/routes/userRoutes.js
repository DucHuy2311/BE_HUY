const express = require('express');const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getAllUsers,    getUserById,
    updateUser,    deleteUser,
    changePassword,    getUserProfile
} = require('../controllers/userController');

// Public routesrouter.get('/profile', authenticateToken, getUserProfile);
// Protected routes - require authentication

router.put('/change-password', authenticateToken, changePassword);
router.put('/profile', authenticateToken, updateUser);

// Admin only routes
router.get('/', authenticateToken, authorizeRole(['admin']), getAllUsers);
router.get('/:id', authenticateToken, authorizeRole(['admin']), getUserById);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deleteUser);

module.exports = router;












