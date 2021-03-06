import omit from 'lodash.omit';
import { ModifyRelationOptions } from '@moogs/core';
import { ResolverMethodOpts } from '../../decorators';
import { RelationTypeMap, ResolverRelation, ResolverRelationReference } from './relations.interface';
import { Authorizer } from '../../auth';
import { getAuthFilter, getRelationAuthFilter } from '../helpers';

export const flattenRelations = <RT extends ResolverRelation<unknown> | ResolverRelationReference<unknown, unknown>>(
  relationOptions: RelationTypeMap<RT>,
): RT[] => {
  return Object.keys(relationOptions).map((name) => ({ dtoName: name, ...relationOptions[name] }));
};

export const removeRelationOpts = <Relation>(
  opts: ResolverRelation<Relation> | ResolverRelationReference<unknown, Relation>,
): ResolverMethodOpts => {
  return omit(
    opts,
    'DTO',
    'keys',
    'nullable',
    'dtoName',
    'relationName',
    'disableRead',
    'disableUpdate',
    'disableRemove',
  );
};

export const getModifyRelationOptions = async <DTO, Relation>(
  relationName: string,
  authorizer?: Authorizer<DTO>,
  context?: unknown,
): Promise<ModifyRelationOptions<DTO, Relation> | undefined> => {
  if (!authorizer) {
    return undefined;
  }
  return {
    filter: await getAuthFilter(authorizer, context),
    relationFilter: await getRelationAuthFilter(relationName, authorizer, context),
  };
};
