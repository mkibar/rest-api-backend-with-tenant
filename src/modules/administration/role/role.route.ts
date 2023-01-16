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

router.get('/list', getListRolesHandler);

router.get('/:id', getRoleHandler);

router.put('/', validate(createRoleSchema), insertRoleHandler);

router.post('/:roleId', updateRoleHandler);

router.delete('/:roleId', deleteRoleHandler);

export default router;
