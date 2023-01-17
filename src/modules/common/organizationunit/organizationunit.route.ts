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

router.get('/list', getListOrganizationUnitsHandler);

router.get('/:id', getOrganizationUnitHandler);

router.put('/', validate(createOrganizationUnitSchema), insertOrganizationUnitHandler);

router.post('/:d', updateOrganizationUnitHandler);

router.delete('/:id', deleteOrganizationUnitHandler);

export default router;
