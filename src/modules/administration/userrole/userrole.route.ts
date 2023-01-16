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

router.get('/list', getListUserRolesHandler);

router.get('/:id', getUserRoleHandler);

router.put('/', validate(createUserRoleSchema), insertUserRoleHandler);

router.post('/:userRoleId', updateUserRoleHandler);

router.delete('/:userRoleId', deleteUserRoleHandler);

export default router;
