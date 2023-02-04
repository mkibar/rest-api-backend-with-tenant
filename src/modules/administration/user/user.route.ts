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

/**
 * @swagger
 * /user/{id}:
 *      get:
 *          summary: Gets a user by ID
 *          tags:
 *              - UserEndpoints
 *          description: Get an existing user with the specified ID
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The User ID
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: OK
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
 *                                      example: User object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/:id', getUserHandler);

router.put('/', validate(createUserSchema), insertUserHandler);

/**
 * @swagger
 * /user/{userId}:
 *      post:
 *          summary: Update user
 *          tags:
 *              - UserEndpoints
 *          description: Updates an existing user with the specified ID
 *          parameters:
 *              - name: userId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The User ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: User's name
 *                              lastName:
 *                                  type: string
 *                                  example: User's last name
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
router.post('/:userId', updateUserHandler);

/**
 * @swagger
 * /user/{userId}:
 *      delete:
 *          parameters:
 *              - name: userId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The User ID
 *          summary: Deletes the user with the specified ID
 *          tags:
 *              - UserEndpoints
 *          description: Delete user with userId parameter
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: User was deleted
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
router.delete('/:userId', deleteUserHandler);

export default router;
