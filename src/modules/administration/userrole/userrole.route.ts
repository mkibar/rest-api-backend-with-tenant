import express from 'express';
import {
    updateUserRoleHandler,
    getUserRoleHandler,
    insertUserRoleHandler,
    deleteUserRoleHandler,
    getListUserRolesHandler
} from './userrole.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { validate } from '../../../middleware/validate';
import { createUserRoleSchema } from './userrole.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

/**
 * @swagger
 * /api/userrole/list:
 *      get:
 *          summary: Gets userrole list
 *          tags:
 *              - UserRoleEndpoints
 *          description: Get userrole list with the specified parameters
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
 *              - name: userId
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  userId
 *              - name: roleId
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  roleId 
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
 *                                      example: Tenant object
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
router.get('/list', getListUserRolesHandler);

/**
 * @swagger
 * /api/userrole/{id}:
 *      get:
 *          summary: Gets a userrole by ID
 *          tags:
 *              - UserRoleEndpoints
 *          description: Get an existing userrole with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The UserRole ID
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
 *                                      example: UserRole object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/:id', getUserRoleHandler);

/**
 * @swagger
 * /api/userrole:
 *      put:
 *          summary: Insert userrole
 *          tags:
 *              - UserRoleEndpoints
 *          description: Insert userrole
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  type: string
 *                                  example: User's Id
 *                                  required: true
 *                              role:
 *                                  type: string
 *                                  example: Role's Id
 *          responses:
 *              200:
 *                  description: UserRole was inserted
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
 *                  description: User and Role must be unique               
 *              500:
 *                  description: Internal server error
 */
router.put('/', validate(createUserRoleSchema), insertUserRoleHandler);

/**
 * @swagger
 * /api/userrole/{userRoleId}:
 *      post:
 *          summary: Update userrole
 *          tags:
 *              - UserRoleEndpoints
 *          description: Updates an existing userrole with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: userRoleId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The Userrole ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  type: string
 *                                  example: User's Id
 *                              role:
 *                                  type: string
 *                                  example: Role's Id
 *          responses:
 *              200:
 *                  description: Userrole was updated
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
router.post('/:userRoleId', updateUserRoleHandler);

/**
 * @swagger
 * /api/userrole/{userRoleId}:
 *      delete:
 *          parameters:
 *              - name: userRoleId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The UserRole ID
 *          summary: Deletes the userrole with the specified ID
 *          tags:
 *              - UserRoleEndpoints
 *          description: Delete userrole with userId parameter
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: Userrole was deleted
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
router.delete('/:userRoleId', deleteUserRoleHandler);

export default router;
