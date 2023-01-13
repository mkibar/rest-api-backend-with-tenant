import express from 'express';
import {
  getAllUsersHandler,
  getMeHandler
} from './user.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { restrictTo } from '../../../middleware/restrictTo';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get AllUsers route for admin
router.get('/query', restrictTo('admin'), getAllUsersHandler);

// myInfo route
router.get('/me', getMeHandler);

export default router;
