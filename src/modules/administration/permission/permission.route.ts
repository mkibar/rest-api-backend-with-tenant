import express from 'express';
import {
    updatePermissionHandler,
    getPermissionHandler,
    insertPermissionHandler,
    deletePermissionHandler,
    getListPermissionsHandler
} from './permission.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { validate } from '../../../middleware/validate';
import { createPermissionSchema } from './permission.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

/**
 * @swagger
 * /api/permission/list:
 *      get:
 *          summary: Gets permission list
 *          tags:
 *              - PermissionEndpoints
 *          description: Get permission list with the specified parameters
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
 *                description:  Search word, permission code 
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
 *                                      example: Permission object
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
router.get('/list', getListPermissionsHandler);

/**
 * @swagger
 * /api/permission/{id}:
 *      get:
 *          summary: Gets a permission by ID
 *          tags:
 *              - PermissionEndpoints
 *          description: Get an existing permission with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The permission ID
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
 *                                      example: permission object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/:id', getPermissionHandler);

/**
 * @swagger
 * /api/permission:
 *      put:
 *          summary: Insert permission
 *          tags:
 *              - PermissionEndpoints
 *          description: Insert permission
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: string
 *                                  example: Project.User.Add
 *                                  required: true
 *                              displayName:
 *                                  type: string
 *                                  example: Delete User
 *                              parentCode:
 *                                  type: string
 *                                  example: Project.User
 *                              isEnabled:
 *                                  type: boolean
 *                                  example: true
 *                              user:
 *                                  type: string
 *                                  example: userId
 *                              role:
 *                                  type: string
 *                                  example: roleId
 *          responses:
 *              200:
 *                  description: Permission was inserted
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
router.put('/', validate(createPermissionSchema), insertPermissionHandler);

/**
 * @swagger
 * /api/permission/{permissionId}:
 *      post:
 *          summary: Update permission
 *          tags:
 *              - PermissionEndpoints
 *          description: Updates an existing permission with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: permissionId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The permission ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              code:
 *                                  type: string
 *                                  example: Project.User.Delete
 *                              displayName:
 *                                  type: string
 *                                  example: Delete permission
 *          responses:
 *              200:
 *                  description: Permission was updated
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
router.post('/:permissionId', updatePermissionHandler);

/**
 * @swagger
 * /api/permission/{permissionId}:
 *      delete:
 *          parameters:
 *              - name: permissionId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The Permission ID
 *          summary: Deletes the permission with the specified ID
 *          tags:
 *              - PermissionEndpoints
 *          description: Delete Permission with permissionId parameter
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: Permission was deleted
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
router.delete('/:permissionId', deletePermissionHandler);

export default router;
