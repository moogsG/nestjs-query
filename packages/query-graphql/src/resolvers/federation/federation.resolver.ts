import { Class, QueryService } from '@moogs-nestjs-query/core';
import { ReadRelationsResolver } from '../relations';
import { ServiceResolver } from '../resolver.interface';
import { getRelations } from '../../decorators';
import { BaseResolverOptions } from '../../decorators/resolver-method.decorator';

export const FederationResolver = <
  DTO,
  QS extends QueryService<DTO, unknown, unknown> = QueryService<DTO, unknown, unknown>
>(
  DTOClass: Class<DTO>,
  opts: BaseResolverOptions = {},
): Class<ServiceResolver<DTO, QS>> => {
  return ReadRelationsResolver(DTOClass, getRelations(DTOClass, opts));
};
