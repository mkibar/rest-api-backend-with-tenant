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

router.get('/list', getListPermissionsHandler);

router.get('/:id', getPermissionHandler);

router.put('/', validate(createPermissionSchema), insertPermissionHandler);

router.post('/:permissionId', updatePermissionHandler);

router.delete('/:permissionId', deletePermissionHandler);

export default router;
