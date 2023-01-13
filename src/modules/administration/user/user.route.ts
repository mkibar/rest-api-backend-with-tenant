import express from 'express';
import {
  updateUserHandler,
  getUserHandler,
  insertUserHandler,
  deleteUserHandler
} from './user.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get('/:id', getUserHandler);

router.put('/', insertUserHandler);           // TODO: validate > validate(createUserSchema)

router.post('/:userId', updateUserHandler);   // TODO: validate > validate(createUserSchema)

router.delete('/:userId', deleteUserHandler);

export default router;
