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

/**
 * @swagger
 * /api/user/query:
 *      get:
 *          summary: Gets user list
 *          tags:
 *              - UserEndpoints
 *          description: Get user list with the specified parameters
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: page
 *                in: query
 *                schema:
 *                  type: integer 
 *                description:  Page number
 *              - name: items_per_page
 *                in: query
 *                schema:
 *                  type: integer 
 *                description:  Items count per page
 *              - name: search
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  Search word, name and email for fields
 *              - name: sort
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  Sort field
 *              - name: order
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  If sort field exist, sort direction. Acceptable values, 1 or 0 
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
 *                                  payload:
 *                                      type: object
 *                                      example:  { "pagination": { "page": 1, "items_per_page": 10, "total": 1, "links": [ { "url": null, "label": "&laquo; Previous", "active": false, "page": null }, { "url": "/?page=1", "label": "1", "active": true, "page": 1 } ],  "first_page_url": "/?page=1", "last_page": 1, "from": 1, "to": 1, "next_page_url": null, "prev_page_url": null } }
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/query', restrictTo('admin'), getAllUsersHandler);

// myInfo route   TODO: will delete
router.get('/me', getMeHandler);

/**
 * @swagger
 * /api/user/{id}:
 *      get:
 *          summary: Gets a user by ID
 *          tags:
 *              - UserEndpoints
 *          description: Get an existing user with the specified ID
 *          security:
 *              - bearerAuth: []
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

/**
 * @swagger
 * /api/user:
 *      put:
 *          summary: Insert user
 *          tags:
 *              - UserEndpoints
 *          description: Insert user
 *          security:
 *              - bearerAuth: []
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
 *                                  required: true
 *                              lastName:
 *                                  type: string
 *                                  example: User's last name
 *                              email:
 *                                  type: string
 *                                  example: User's email, must be unique, must be valid e-mail format
 *                                  required: true
 *                              password:
 *                                  type: string
 *                                  example: User's password, Password must be between 8 and 32 characters
 *                                  required: true
 *                              passwordConfirm:
 *                                  type: string
 *                                  example: Confirm password, must be equal password field
 *                                  required: true
 *          responses:
 *              200:
 *                  description: User was inserted
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
 *              409:
 *                  description: e-mail must be unique               
 *              500:
 *                  description: Internal server error
 */
router.put('/', validate(createUserSchema), insertUserHandler);

/**
 * @swagger
 * /api/user/{userId}:
 *      post:
 *          summary: Update user
 *          tags:
 *              - UserEndpoints
 *          description: Updates an existing user with the specified ID
 *          security:
 *              - bearerAuth: []
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
 * /api/user/{userId}:
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
 *          security:
 *              - bearerAuth: []
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
