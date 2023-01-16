import { object, string, TypeOf } from 'zod';

export const createUserRoleSchema = object({
    body: object({
        user: string({ required_error: 'User is required' }),
        role: string({ required_error: 'Role is required' }),
    })
});

export type CreateUserRoleInput = TypeOf<typeof createUserRoleSchema>['body'];
