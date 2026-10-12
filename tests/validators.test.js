import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerSchema, loginSchema, updateProfileSchema } from '../server/validators/authValidators.js';
import { createNoteSchema, updateNoteSchema, subjectSchema } from '../server/validators/noteValidators.js';

describe('Zod Auth Validators', () => {
  it('should accept valid registration payloads', async () => {
    const valid = {
      name: 'Ada Lovelace',
      email: 'ada@computing.org',
      password: 'password123',
    };
    const parsed = await registerSchema.parseAsync(valid);
    assert.equal(parsed.name, 'Ada Lovelace');
    assert.equal(parsed.email, 'ada@computing.org');
  });

  it('should reject registration payloads with invalid email or short password', async () => {
    await assert.rejects(
      () =>
        registerSchema.parseAsync({
          name: 'Ada',
          email: 'not-an-email',
          password: '123',
        }),
      /email/i
    );
  });

  it('should reject empty passwords on login', async () => {
    await assert.rejects(
      () =>
        loginSchema.parseAsync({
          email: 'ada@computing.org',
          password: '',
        }),
      /password/i
    );
  });
});

describe('Zod Note & Subject Validators', () => {
  it('should validate note creation with tags and optional defaults', async () => {
    const validNote = {
      title: 'Distributed Consensus with Raft',
      content: 'Leader election, log replication, and safety invariants.',
      tags: ['distributed-systems', 'consensus'],
      isPinned: true,
      color: 'blue',
    };

    const parsed = await createNoteSchema.parseAsync(validNote);
    assert.equal(parsed.title, 'Distributed Consensus with Raft');
    assert.equal(parsed.tags.length, 2);
    assert.equal(parsed.isPinned, true);
    assert.equal(parsed.color, 'blue');
  });

  it('should reject note creation with empty title', async () => {
    await assert.rejects(
      () =>
        createNoteSchema.parseAsync({
          title: '   ',
          content: 'Some note text',
        }),
      /title/i
    );
  });

  it('should validate subject schema', async () => {
    const parsed = await subjectSchema.parseAsync({
      name: 'Computer Networks',
      color: 'sky',
      description: 'TCP/IP, routing, and DNS',
    });
    assert.equal(parsed.name, 'Computer Networks');
    assert.equal(parsed.color, 'sky');
  });
});
