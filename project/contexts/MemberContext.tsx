import { Member } from '@/types';
import { memberStorage } from '@/utils/storage';
import { createMember } from '@/utils/teamUtils';
import * as React from 'react';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface MemberContextType {
  members: Member[];
  loading: boolean;
  addMember: (name: string) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  refreshMembers: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMembers = async () => {
    try {
      setLoading(true);
      const loadedMembers = await memberStorage.getMembers();
      setMembers(loadedMembers);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (name: string) => {
    try {
      const newMember = createMember(name);
      await memberStorage.addMember(newMember);
      setMembers(prev => [...prev, newMember]);
    } catch (error) {
      console.error('Failed to add member:', error);
      throw error;
    }
  };

  const updateMember = async (updatedMember: Member) => {
    try {
      await memberStorage.updateMember(updatedMember);
      setMembers(prev => 
        prev.map(member => 
          member.id === updatedMember.id ? updatedMember : member
        )
      );
    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await memberStorage.deleteMember(id);
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error('Failed to delete member:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshMembers();
  }, []);

  const value: MemberContextType = {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    refreshMembers,
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
};
