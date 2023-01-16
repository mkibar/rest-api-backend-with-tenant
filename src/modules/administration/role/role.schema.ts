import { object, string, TypeOf } from 'zod';

export const createRoleSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
    })
});

export type CreateRoleInput = TypeOf<typeof createRoleSchema>['body'];
