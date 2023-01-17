import express from 'express';
import {
  updateUserHandler,
  getUserHandler,
  insertUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getMeHandler
} from './user.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { restrictTo } from '../../../middleware/restrictTo';
import { validate } from '../../../middleware/validate';
import { createUserSchema } from './user.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get AllUsers route for admin
router.get('/query', restrictTo('admin'), getAllUsersHandler);

// myInfo route   TODO: will delete
router.get('/me', getMeHandler);

router.get('/:id', getUserHandler);

router.put('/', validate(createUserSchema), insertUserHandler);

router.post('/:userId', updateUserHandler);

router.delete('/:userId', deleteUserHandler);

export default router;
