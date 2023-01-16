import { object, string, TypeOf } from 'zod';

export const createPermissionSchema = object({
    body: object({
        code: string({ required_error: 'Code is required' }),
    })
});

export type CreatePermissionInput = TypeOf<typeof createPermissionSchema>['body'];
