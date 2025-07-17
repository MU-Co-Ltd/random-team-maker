import { Member, TeamDivisionParams, TeamDivisionResult } from '@/types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createMember = (name: string): Member => {
  const now = new Date();
  return {
    id: generateId(),
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
  };
};

export const divideTeams = (params: TeamDivisionParams): TeamDivisionResult => {
  const { selectedMembers, teamSize } = params;
  
  // メンバーをシャッフル
  const shuffledMembers = [...selectedMembers].sort(() => Math.random() - 0.5);
  
  // チームに分ける
  const teams: Member[][] = [];
  for (let i = 0; i < shuffledMembers.length; i += teamSize) {
    teams.push(shuffledMembers.slice(i, i + teamSize));
  }
  
  return {
    id: generateId(),
    participants: selectedMembers,
    teamSize,
    teams,
    createdAt: new Date(),
  };
};

export const validateMemberName = (name: string): string | null => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return '名前を入力してください';
  }
  if (trimmedName.length > 50) {
    return '名前は50文字以内で入力してください';
  }
  return null;
};

export const validateTeamSize = (teamSize: number, totalMembers: number): string | null => {
  if (teamSize < 1) {
    return 'チーム人数は1人以上を指定してください';
  }
  if (teamSize > totalMembers) {
    return 'チーム人数は参加者数以下を指定してください';
  }
  return null;
};
