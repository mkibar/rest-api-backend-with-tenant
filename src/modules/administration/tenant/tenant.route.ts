import express from 'express';
import {
    updateTenantHandler,
    getTenantHandler,
    insertTenantHandler,
    deleteTenantHandler,
    getListTenantsHandler
} from './tenant.controller';
import { deserializeUser } from '../../../middleware/deserializeUser';
import { requireUser } from '../../../middleware/requireUser';
import { validate } from '../../../middleware/validate';
import { createTenantSchema } from './tenant.schema';

const router = express.Router();

router.use(deserializeUser, requireUser);


/**
 * @swagger
 * /api/tenant/list:
 *      get:
 *          summary: Gets tenant list
 *          tags:
 *              - TenantEndpoints
 *          description: Get tenant list with the specified parameters
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
 *                description:  Search word, tenant Name
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
router.get('/list', getListTenantsHandler);

/**
 * @swagger
 * /api/tenant/{id}:
 *      get:
 *          summary: Gets a tenant by ID
 *          tags:
 *              - TenantEndpoints
 *          description: Get an existing tenant with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: id
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The Tenant ID
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
router.get('/:id', getTenantHandler);

/**
 * @swagger
 * /api/tenant:
 *      put:
 *          summary: Insert tenant
 *          tags:
 *              - TenantEndpoints
 *          description: Insert tenant
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
 *                                  example: Tenant's name, will be unique
 *                                  required: true
 *                              isEnabled:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Tenant was inserted
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
router.put('/', validate(createTenantSchema), insertTenantHandler);

/**
 * @swagger
 * /api/tenant/{tenantId}:
 *      post:
 *          summary: Update tenant
 *          tags:
 *              - TenantEndpoints
 *          description: Updates an existing tenant with the specified ID
 *          security:
 *              - bearerAuth: []
 *          parameters:
 *              - name: tenantId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The Tenant ID
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  example: Tenant's name
 *                              isEnabled:
 *                                  type: boolean
 *                                  example: true
 *          responses:
 *              200:
 *                  description: Tenant was updated
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
router.post('/:tenantId', updateTenantHandler);

/**
 * @swagger
 * /api/tenant/{tenantId}:
 *      delete:
 *          parameters:
 *              - name: tenantId
 *                in: path
 *                schema:
 *                  type: string 
 *                required: true
 *                description:  The Tenant ID
 *          summary: Deletes the tenant with the specified ID
 *          tags:
 *              - TenantEndpoints
 *          description: Delete tenant with tenantId parameter
 *          security:
 *              - bearerAuth: []
 *          requestBody:
 *              required: false
 *          responses:
 *              200:
 *                  description: Tenant was deleted
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
router.delete('/:tenantId', deleteTenantHandler);

export default router;
