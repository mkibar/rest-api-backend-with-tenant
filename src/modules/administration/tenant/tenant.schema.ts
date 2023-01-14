import { object, string, TypeOf } from 'zod';

export const createTenantSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
    })
});

export type CreateUserInput = TypeOf<typeof createTenantSchema>['body'];
