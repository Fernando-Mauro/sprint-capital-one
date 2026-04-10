import { describe, test, expect } from '@jest/globals';
import { canJoinReta, kickPlayer } from './matchmaking';

describe('Matchmaking Logic - Join Match', () => {
  test('should not allow joining a full match', () => {
    const result = canJoinReta(10, 10, 'intermediate', 'intermediate');
    expect(result.success).toBe(false);
    expect(result.warning).toBe(false);
    expect(result.message).toBe('The match is full.');
  });

  test('should send a warning when a beginner joins an advanced match', () => {
    const result = canJoinReta(5, 10, 'beginner', 'advanced');
    expect(result.success).toBe(true);
    expect(result.warning).toBe(true);
    expect(result.message).toContain('Warning');
  });

  test('should allow joining normally without warnings when skill levels match', () => {
    const result = canJoinReta(5, 10, 'intermediate', 'intermediate');
    expect(result.success).toBe(true);
    expect(result.warning).toBe(false);
  });
});

describe('Matchmaking Logic - Kick Player', () => {
  test('the organizer can kick a player', () => {
    const result = kickPlayer(true, 'confirmed');
    expect(result.success).toBe(true);
    expect(result.newStatus).toBe('kicked');
  });

  test('a regular player cannot kick another player', () => {
    const result = kickPlayer(false, 'confirmed');
    expect(result.success).toBe(false);
    expect(result.newStatus).toBe('confirmed');
  });
});
