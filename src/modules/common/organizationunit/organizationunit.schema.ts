import { object, string, TypeOf } from 'zod';

export const createOrganizationUnitSchema = object({
    body: object({
        name: string({ required_error: 'Name is required' }),
    })
});

export type CreateOrganizationUnitInput = TypeOf<typeof createOrganizationUnitSchema>['body'];
