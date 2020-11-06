import { QueryService } from '@moogs/core';

export interface NestjsQueryDataloader<DTO, Args, Result> {
  createLoader(service: QueryService<DTO, unknown, unknown>): (args: ReadonlyArray<Args>) => Promise<Result[]>;
}
