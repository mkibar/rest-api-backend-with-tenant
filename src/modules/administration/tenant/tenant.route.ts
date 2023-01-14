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

router.get('/list', getListTenantsHandler);

router.get('/:id', getTenantHandler);

router.put('/', validate(createTenantSchema), insertTenantHandler);

router.post('/:tenantId', updateTenantHandler);

router.delete('/:tenantId', deleteTenantHandler);

export default router;
