import { Class } from '@moogs/core';

export const getAuthorizerToken = <DTO>(DTOClass: Class<DTO>): string => `${DTOClass.name}Authorizer`;
