import { Class } from '@moogs/core';
import { Inject } from '@nestjs/common';
import { getAuthorizerToken } from '../auth';

export const InjectAuthorizer = <DTO>(DTOClass: Class<DTO>): ParameterDecorator => Inject(getAuthorizerToken(DTOClass));
