type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

interface MatchmakingResult {
  success: boolean;
  warning: boolean;
  message: string;
}

interface KickResult {
  success: boolean;
  newStatus: string;
  message: string;
}

export function canJoinReta(
  currentPlayers: number,
  maxPlayers: number,
  userSkill: SkillLevel,
  retaSkill: SkillLevel,
): MatchmakingResult {
  // Rule 1: Capacity check (hard block)
  if (currentPlayers >= maxPlayers) {
    return { success: false, warning: false, message: 'The match is full.' };
  }

  // Rule 2: Skill level warning (non-blocking)
  if (userSkill === 'beginner' && retaSkill === 'advanced') {
    return {
      success: true,
      warning: true,
      message: 'Warning: This match level is advanced for your profile.',
    };
  }

  // Happy path
  return {
    success: true,
    warning: false,
    message: 'You have successfully joined the match.',
  };
}

export function kickPlayer(isOrganizer: boolean, targetPlayerStatus: string): KickResult {
  // Rule: Only the organizer can kick players
  if (!isOrganizer) {
    return {
      success: false,
      newStatus: targetPlayerStatus,
      message: 'You do not have organizer permissions to kick players.',
    };
  }

  return {
    success: true,
    newStatus: 'kicked',
    message: 'Player kicked successfully.',
  };
}
