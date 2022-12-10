import express from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema } from '../schema/user.schema';
// import { deserializeUser } from '../middleware/deserializeUser';//mk
// import { requireUser } from '../middleware/requireUser';//mk
import { getMeHandler } from '../controllers/user.controller';//mk

const router = express.Router();

// Register user route
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
router.post('/login', validate(loginUserSchema), loginHandler);

//router.use(deserializeUser, requireUser);
// Verify Token route
router.post('/verify_token', getMeHandler);

export default router;
