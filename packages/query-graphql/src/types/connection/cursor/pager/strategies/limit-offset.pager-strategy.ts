import { cursorToOffset, offsetToCursor } from 'graphql-relay';
import { Query } from '@moogs/core';
import { CursorPagingType } from '../../../../query';
import { OffsetPagingOpts, PagerStrategy } from './pager-strategy';
import { hasBeforeCursor, isBackwardPaging, isForwardPaging } from './helpers';

export class LimitOffsetPagerStrategy<DTO> implements PagerStrategy<DTO> {
  toCursor(dto: DTO, index: number, pagingOpts: OffsetPagingOpts): string {
    return offsetToCursor(pagingOpts.offset + index);
  }

  fromCursorArgs(cursor: CursorPagingType): OffsetPagingOpts {
    const isForward = isForwardPaging(cursor);
    const isBackward = isBackwardPaging(cursor);
    const hasBefore = hasBeforeCursor(cursor);
    return { limit: this.getLimit(cursor), offset: this.getOffset(cursor), isForward, isBackward, hasBefore };
  }

  isEmptyCursor(opts: OffsetPagingOpts): boolean {
    return opts.offset === 0;
  }

  createQuery(query: Query<DTO>, opts: OffsetPagingOpts, includeExtraNode: boolean): Query<DTO> {
    const { isBackward } = opts;
    const paging = { limit: opts.limit, offset: opts.offset };
    if (includeExtraNode) {
      // Add 1 to the limit so we will fetch an additional node
      paging.limit += 1;
      // if paging backwards remove one from the offset to check for a previous page.
      if (isBackward) {
        paging.offset -= 1;
      }
      if (paging.offset < 0) {
        // if the offset is < 0 it means we underflowed and that we cant have an extra page.
        paging.offset = 0;
        paging.limit = opts.limit;
      }
    }
    return { ...query, paging };
  }

  checkForExtraNode(nodes: DTO[], opts: OffsetPagingOpts): DTO[] {
    const returnNodes = [...nodes];
    // check if we have an additional node
    // if paging forward that indicates we have a next page
    // if paging backward that indicates we have a previous page.
    const hasExtraNode = nodes.length > opts.limit;
    if (hasExtraNode) {
      // remove the additional node so its not returned in the results.
      if (opts.isForward) {
        returnNodes.pop();
      } else {
        returnNodes.shift();
      }
    }
    return returnNodes;
  }

  private getLimit(cursor: CursorPagingType): number {
    if (isBackwardPaging(cursor)) {
      const { last = 0, before } = cursor;
      const offsetFromCursor = before ? cursorToOffset(before) : 0;
      const offset = offsetFromCursor - last;
      // Check to see if our before-page is underflowing past the 0th item
      if (offset < 0) {
        // Adjust the limit with the underflow value
        return Math.max(last + offset, 0);
      }
      return last;
    }
    return cursor.first || 0;
  }

  private getOffset(cursor: CursorPagingType): number {
    if (isBackwardPaging(cursor)) {
      const { last, before } = cursor;
      const beforeOffset = before ? cursorToOffset(before) : 0;
      const offset = last ? beforeOffset - last : 0;

      // Check to see if our before-page is underflowing past the 0th item
      return Math.max(offset, 0);
    }
    const { after } = cursor;
    const offset = after ? cursorToOffset(after) + 1 : 0;
    return Math.max(offset, 0);
  }
}
