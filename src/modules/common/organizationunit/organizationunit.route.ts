import express from 'express';
import {
    updateOrganizationUnitHandler,
    getOrganizationUnitHandler,
    insertOrganizationUnitHandler,
    deleteOrganizationUnitHandler,
    getListOrganizationUnitsHandler
} from './organizationunit.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { validate } from '../../../middleware/validate';
import { createOrganizationUnitSchema } from './organizationunit.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);

/**
 * @swagger
 * /api/organizationUnit/list:
 *      get:
 *          summary: Gets organizationUnit list
 *          tags:
 *              - OrganizationUnitEndpoints
 *          description: Get organizationUnit list with the specified parameters
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
 *                description:  Search word, OrganizationUnit name 
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
 *                                      example: organizationUnit object
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
router.get('/list', getListOrganizationUnitsHandler);

/**
 * @swagger
 * /api/organizationUnit/{id}:
 *      get:
 *          summary: Gets a organizationUnit by ID
 *          tags:
 *              - OrganizationUnitEndpoints
 *          description: Get an existing organizationUnit with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The organizationUnit ID
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
 *                                      example: organizationUnit object
 *              401:
 *                  description: Unauthorized
 *              404:
 *                  description: Not found
 *              500:
 *                  description: Internal server error
 */
router.get('/:id', getOrganizationUnitHandler);

/**
 * @swagger
 * /api/organizationUnit:
 *      put:
 *          summary: Insert organizationUnit
 *          tags:
 *              - OrganizationUnitEndpoints
 *          description: Insert organizationUnit
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
 *                                  example: organizationUnit's name
 *                                  required: true
 *                              code:
 *                                  type: string
 *                                  example: organizationUnit's code
 *                              parent:
 *                                  type: string
 *                                  example: parent organizationUnit Id
 *          responses:
 *              200:
 *                  description: organizationUnit was inserted
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
 *                  description: organizationUnit name must be unique               
 *              500:
 *                  description: Internal server error
 */
router.put('/', validate(createOrganizationUnitSchema), insertOrganizationUnitHandler);

/**
 * @swagger
 * /api/organizationUnit/{id}:
 *      post:
 *          summary: Update organizationUnit
 *          tags:
 *              - OrganizationUnitEndpoints
 *          description: Updates an existing organizationUnit with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The organizationUnit ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: organizationUnit's name
 *                              code:
 *                                  type: string
 *                                  example: organizationUnit's code
 *                              parent:
 *                                  type: string
 *                                  example: parent organizationUnit's Id
 *          responses:
 *              200:
 *                  description: organizationUnit was updated
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
router.post('/:id', updateOrganizationUnitHandler);

/**
 * @swagger
 * /api/organizationUnit/{id}:
 *      delete:
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The organizationUnit ID
 *          summary: Deletes the organizationUnit with the specified ID
 *          tags:
 *              - OrganizationUnitEndpoints
 *          description: Delete organizationUnit with id parameter
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: OrganizationUnit was deleted
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
router.delete('/:id', deleteOrganizationUnitHandler);

export default router;
