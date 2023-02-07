import express from 'express';
import { loginHandler, logoutHandler, registerHandler } from './auth.controller';
import { validate } from '../../middleware/validate';
import { createUserSchema, loginUserSchema } from '../administration/user/user.schema';
// import { deserializeUser } from '../middleware/deserializeUser';//mk
// import { requireUser } from '../middleware/requireUser';//mk
import { getMeHandler } from '../administration/user/user.controller';//mk
import { deserializeUser } from '../../middleware/deserializeUser';
import { requireUser } from '../../middleware/requireUser';

const router = express.Router();

// Register user route
/**
 * @swagger
 * /api/register:
 *      post:
 *          summary: Register user
 *          tags:
 *              - AuthEndpoints
 *          description: Register user.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: User's email
 *                              name:
 *                                  type: string
 *                                  example: User's first name
 *                              password:
 *                                  type: string
 *                                  example: User's password
 *                              tenant:
 *                                  type: string
 *                                  example: Tenant
 *          responses:
 *              200:
 *                  description: User was updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      example: success
 *                                  data:
 *                                      type: object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.post('/register', validate(createUserSchema), registerHandler);

// Login user route
/**
 * @swagger
 * /api/login:
 *      post:
 *          summary: Login user
 *          tags:
 *              - AuthEndpoints
 *          description: Login user.
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  example: User's email
 *                              password:
 *                                  type: string
 *                                  example: User's password
 *          responses:
 *              200:
 *                  description: User was logged
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  status:
 *                                      type: string
 *                                      example: success
 *                                  api_token:
 *                                      type: string
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.post('/login', validate(loginUserSchema), loginHandler);


router.use(deserializeUser, requireUser);

// Logout user route
router.post('/logout', logoutHandler);

// Verify Token route
router.post('/verify_token', getMeHandler);

export default router;
