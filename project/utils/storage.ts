import { Member, TeamDivisionResult } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEMBERS_KEY = '@team_divider_members';
const HISTORY_KEY = '@team_divider_history';

export const memberStorage = {
  async getMembers(): Promise<Member[]> {
    try {
      const membersJson = await AsyncStorage.getItem(MEMBERS_KEY);
      if (membersJson) {
        const members = JSON.parse(membersJson);
        return members.map((member: any) => ({
          ...member,
          createdAt: new Date(member.createdAt),
          updatedAt: new Date(member.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading members:', error);
      return [];
    }
  },

  async saveMembers(members: Member[]): Promise<void> {
    try {
      const membersJson = JSON.stringify(members);
      await AsyncStorage.setItem(MEMBERS_KEY, membersJson);
    } catch (error) {
      console.error('Error saving members:', error);
      throw error;
    }
  },

  async addMember(member: Member): Promise<void> {
    const members = await this.getMembers();
    members.push(member);
    await this.saveMembers(members);
  },

  async updateMember(updatedMember: Member): Promise<void> {
    const members = await this.getMembers();
    const index = members.findIndex(m => m.id === updatedMember.id);
    if (index !== -1) {
      members[index] = { ...updatedMember, updatedAt: new Date() };
      await this.saveMembers(members);
    }
  },

  async deleteMember(memberId: string): Promise<void> {
    const members = await this.getMembers();
    const filteredMembers = members.filter(m => m.id !== memberId);
    await this.saveMembers(filteredMembers);
  }
};

export const historyStorage = {
  async getHistory(): Promise<TeamDivisionResult[]> {
    try {
      const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        return history.map((result: any) => ({
          ...result,
          createdAt: new Date(result.createdAt),
          participants: result.participants.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          })),
          teams: result.teams.map((team: any[]) => 
            team.map((member: any) => ({
              ...member,
              createdAt: new Date(member.createdAt),
              updatedAt: new Date(member.updatedAt),
            }))
          ),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  async saveResult(result: TeamDivisionResult): Promise<void> {
    try {
      const history = await this.getHistory();
      history.unshift(result); // 最新のものを先頭に追加
      const historyJson = JSON.stringify(history);
      await AsyncStorage.setItem(HISTORY_KEY, historyJson);
    } catch (error) {
      console.error('Error saving history:', error);
      throw error;
    }
  }
};
