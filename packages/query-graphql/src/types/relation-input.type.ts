import { Class } from '@moogs/core';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export interface RelationInputType {
  id: string | number;
  relationId: string | number;
}

/** @internal */
let relationInputType: Class<RelationInputType> | null = null;
// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional
export function RelationInputType(): Class<RelationInputType> {
  if (relationInputType) {
    return relationInputType;
  }
  @InputType()
  class RelationInput implements RelationInputType {
    @Field(() => ID, { description: 'The id of the record.' })
    @IsNotEmpty()
    id!: string | number;

    @Field(() => ID, { description: 'The id of relation.' })
    @IsNotEmpty()
    relationId!: string | number;
  }
  relationInputType = RelationInput;
  return relationInputType;
}
