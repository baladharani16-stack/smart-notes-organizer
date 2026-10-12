import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateWordCount, estimateReadingTime, formatRelativeDate } from '../src/utils/formatDate.js';

describe('Format & Calculation Utilities', () => {
  it('should accurately calculate word counts', () => {
    assert.equal(calculateWordCount(''), 0);
    assert.equal(calculateWordCount('   '), 0);
    assert.equal(calculateWordCount('Hello world'), 2);
    assert.equal(calculateWordCount('Multiple   spaces\nand\tnewlines'), 4);
  });

  it('should estimate reading time properly', () => {
    assert.equal(estimateReadingTime('Quick short note'), '1 min read');
    const words = Array(500).fill('word').join(' ');
    assert.equal(estimateReadingTime(words), '3 min read');
  });

  it('should format relative dates', () => {
    const now = new Date().toISOString();
    assert.equal(formatRelativeDate(now), 'Just now');

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    assert.equal(formatRelativeDate(tenMinutesAgo), '10m ago');

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    assert.equal(formatRelativeDate(twoHoursAgo), '2h ago');
  });
});
