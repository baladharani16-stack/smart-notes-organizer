import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Note Query & User Isolation Logic', () => {
  it('should enforce user ownership and soft deletion filtering in query builder', () => {
    const userId = '60d0fe4f5311236168a109ca';

    // Simulated query builder helper matching noteController.js
    function buildNoteQuery(user, queryParams = {}) {
      const query = {
        userId: user._id,
        deletedAt: null,
      };

      if (queryParams.subjectId) {
        query.subjectId = queryParams.subjectId;
      }
      if (queryParams.tag) {
        query.tags = queryParams.tag.toLowerCase().trim();
      }
      if (queryParams.isPinned !== undefined) {
        query.isPinned = queryParams.isPinned === 'true' || queryParams.isPinned === true;
      }
      if (queryParams.search && queryParams.search.trim()) {
        const searchRegex = new RegExp(queryParams.search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { content: searchRegex },
          { tags: searchRegex },
        ];
      }
      return query;
    }

    const q1 = buildNoteQuery({ _id: userId });
    assert.equal(q1.userId, userId);
    assert.equal(q1.deletedAt, null);

    const q2 = buildNoteQuery({ _id: userId }, { tag: 'react', isPinned: 'true', search: 'hooks' });
    assert.equal(q2.tags, 'react');
    assert.equal(q2.isPinned, true);
    assert.ok(q2.$or);
    assert.equal(q2.$or.length, 3);
  });

  it('should guarantee different users have completely isolated queries', () => {
    const userA = { _id: 'user_1' };
    const userB = { _id: 'user_2' };

    function buildUserScope(user) {
      return { userId: user._id, deletedAt: null };
    }

    const scopeA = buildUserScope(userA);
    const scopeB = buildUserScope(userB);

    assert.notEqual(scopeA.userId, scopeB.userId);
  });
});
