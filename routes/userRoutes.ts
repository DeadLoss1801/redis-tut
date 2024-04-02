// routes/userRoutes.ts
import express from 'express';
import { createUser, getUserById } from '../controllers/userController'; // Import user controllers

const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUserById);

export default router;
