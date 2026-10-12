import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateToken, verifyToken, COOKIE_NAME } from '../server/utils/tokenUtils.js';

describe('Token Utilities', () => {
  it('should generate and verify signed JWTs', () => {
    const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@studyspace.app' };
    const token = generateToken(payload);
    assert.ok(token);
    assert.equal(typeof token, 'string');

    const decoded = verifyToken(token);
    assert.equal(decoded.userId, payload.userId);
    assert.equal(decoded.email, payload.email);
  });

  it('should reject tampered or corrupted tokens', () => {
    const token = generateToken({ userId: '123' });
    const tampered = token.slice(0, -5) + 'xyz12';

    assert.throws(() => {
      verifyToken(tampered);
    });
  });

  it('should use the correct cookie key name', () => {
    assert.equal(COOKIE_NAME, 'studyspace_token');
  });
});
