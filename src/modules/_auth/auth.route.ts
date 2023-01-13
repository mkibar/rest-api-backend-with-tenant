import express from 'express';
import { loginHandler, registerHandler } from './auth.controller';
import { validate } from '../../middleware/validate';
import { createUserSchema, loginUserSchema } from '../administration/user/user.schema';
// import { deserializeUser } from '../middleware/deserializeUser';//mk
// import { requireUser } from '../middleware/requireUser';//mk
import { getMeHandler } from '../administration/user/user.controller';//mk

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

//router.use(deserializeUser, requireUser);
// Verify Token route
router.post('/verify_token', getMeHandler);

export default router;
