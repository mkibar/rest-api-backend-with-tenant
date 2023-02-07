import express from 'express';
import {
    updateRoleHandler,
    getRoleHandler,
    insertRoleHandler,
    deleteRoleHandler,
    getListRolesHandler
} from './role.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { validate } from '../../../middleware/validate';
import { createRoleSchema } from './role.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

/**
 * @swagger
 * /api/role/list:
 *      get:
 *          summary: Gets role list
 *          tags:
 *              - RoleEndpoints
 *          description: Get role list with the specified parameters
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
 *              - name: search
 *                in: query
 *                schema:
 *                  type: string 
 *                description:  Search word for role name 
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
 *                                      example: Role object
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
router.get('/list', getListRolesHandler);

/**
 * @swagger
 * /api/role/{id}:
 *      get:
 *          summary: Gets a role by ID
 *          tags:
 *              - RoleEndpoints
 *          description: Get an existing role with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The role ID
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
 *                                      example: Role object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/:id', getRoleHandler);

/**
 * @swagger
 * /api/role:
 *      put:
 *          summary: Insert role
 *          tags:
 *              - RoleEndpoints
 *          description: Insert role
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
 *                                  example: admin
 *                                  required: true
 *          responses:
 *              200:
 *                  description: Role was inserted
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
 *                  description: Role name must be unique               
 *              500:
 *                  description: Internal server error
 */
router.put('/', validate(createRoleSchema), insertRoleHandler);

/**
 * @swagger
 * /api/role/{roleId}:
 *      post:
 *          summary: Update role
 *          tags:
 *              - RoleEndpoints
 *          description: Updates an existing role with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: roleId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The role ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: admin
 *          responses:
 *              200:
 *                  description: Role was updated
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
router.post('/:roleId', updateRoleHandler);

/**
 * @swagger
 * /api/role/{roleId}:
 *      delete:
 *          parameters:
 *              - name: roleId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The role ID
 *          summary: Deletes the role with the specified ID
 *          tags:
 *              - RoleEndpoints
 *          description: Delete role with roleId parameter
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: Role was deleted
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
router.delete('/:roleId', deleteRoleHandler);

export default router;
