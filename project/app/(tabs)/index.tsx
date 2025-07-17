import { Colors } from '@/constants/Colors';
import { useMemberContext } from '@/contexts/MemberContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Member, TeamDivisionResult } from '@/types';
import { historyStorage } from '@/utils/storage';
import { divideTeams, validateTeamSize } from '@/utils/teamUtils';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TeamDivisionTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { members } = useMemberContext();
  
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [teamSize, setTeamSize] = useState('3');
  const [divisionResult, setDivisionResult] = useState<TeamDivisionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const toggleMemberSelection = (member: Member) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const selectAllMembers = () => {
    setSelectedMembers(members);
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const handleDivideTeams = async () => {
    const teamSizeNum = parseInt(teamSize);
    
    if (selectedMembers.length === 0) {
      Alert.alert('エラー', '参加者を選択してください');
      return;
    }

    const error = validateTeamSize(teamSizeNum, selectedMembers.length);
    if (error) {
      Alert.alert('エラー', error);
      return;
    }

    try {
      const result = divideTeams({
        selectedMembers,
        teamSize: teamSizeNum,
      });
      
      await historyStorage.saveResult(result);
      setDivisionResult(result);
      setShowResult(true);
    } catch {
      Alert.alert('エラー', 'チーム分けに失敗しました');
    }
  };

  if (!members || members.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            メンバーが登録されていません
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text + '80' }]}>
            「メンバー管理」タブからメンバーを追加してください
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            チーム分け
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
            選択中: {selectedMembers.length}人 / 全{members.length}人
          </Text>
        </View>

      <View style={styles.configSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          チーム設定
        </Text>
        <View style={styles.configRow}>
          <Text style={[styles.configLabel, { color: colors.text }]}>
            チーム人数:
          </Text>
          <TextInput
            style={[styles.teamSizeInput, { borderColor: colors.text + '30', color: colors.text }]}
            value={teamSize}
            onChangeText={setTeamSize}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={[styles.configLabel, { color: colors.text }]}>
            人
          </Text>
        </View>
        {parseInt(teamSize) > 0 && selectedMembers.length > 0 && (
          <Text style={[styles.previewText, { color: colors.text + '60' }]}>
            {Math.ceil(selectedMembers.length / parseInt(teamSize))}チームに分かれます
          </Text>
        )}
      </View>

      <View style={styles.selectionControls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: colors.tint }]}
          onPress={selectAllMembers}
        >
          <Text style={[styles.controlButtonText, { color: colorScheme === 'dark' ? colors.background : 'white' }]}>全選択</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: '#666' }]}
          onPress={clearSelection}
        >
          <Text style={[styles.controlButtonText, { color: 'white' }]}>クリア</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.divideButton,
            {
              backgroundColor: selectedMembers.length > 0 ? '#FF6B35' : '#ccc', // オレンジ色で強調
              borderWidth: selectedMembers.length > 0 ? 2 : 0,
              borderColor: selectedMembers.length > 0 ? '#FF4500' : 'transparent',
              transform: selectedMembers.length > 0 ? [{ scale: 1.02 }] : [{ scale: 1 }],
            }
          ]}
          onPress={handleDivideTeams}
          disabled={selectedMembers.length === 0}
        >
          <Text style={[
            styles.divideButtonText, 
            { 
              color: selectedMembers.length > 0 ? 'white' : '#999',
              textShadowColor: selectedMembers.length > 0 ? 'rgba(0,0,0,0.3)' : 'transparent',
              textShadowOffset: selectedMembers.length > 0 ? { width: 0, height: 1 } : { width: 0, height: 0 },
              textShadowRadius: selectedMembers.length > 0 ? 2 : 0,
            }
          ]}>チーム分け実行</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.memberSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          参加者選択
        </Text>
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedMembers.some(m => m.id === item.id);
            
            return (
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  {
                    backgroundColor: isSelected ? colors.tint + '20' : 'transparent',
                    borderColor: colors.text + '20'
                  }
                ]}
                onPress={() => toggleMemberSelection(item)}
              >
                <View style={styles.memberContent}>
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected ? colors.tint : 'transparent',
                        borderColor: colors.tint
                      }
                    ]}
                  >
                    {isSelected && <Text style={[styles.checkmark, { color: colorScheme === 'dark' ? colors.background : 'white' }]}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          style={styles.memberList}
        />
      </View>

      <Modal visible={showResult} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              チーム分け結果
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowResult(false)}
            >
              <Text style={[styles.closeButtonText, { color: colorScheme === 'dark' ? colors.background : 'white' }]}>閉じる</Text>
            </TouchableOpacity>
          </View>
          
          {divisionResult && (
            <FlatList
              data={divisionResult.teams}
              keyExtractor={(_, index) => `team-${index}`}
              renderItem={({ item: team, index }) => (
                <View style={[styles.teamContainer, { borderColor: colors.text + '20' }]}>
                  <Text style={[styles.teamTitle, { color: colors.text }]}>
                    チーム {index + 1} ({team.length}人)
                  </Text>
                  {team.map((member, memberIndex) => (
                    <Text
                      key={member.id}
                      style={[styles.teamMember, { color: colors.text }]}
                    >
                      {memberIndex + 1}. {member.name}
                    </Text>
                  ))}
                </View>
              )}
              style={styles.teamList}
            />
          )}
        </SafeAreaView>
      </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  configSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  configLabel: {
    fontSize: 16,
  },
  teamSizeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 60,
    textAlign: 'center',
  },
  previewText: {
    fontSize: 14,
    marginTop: 12,
    paddingLeft: 4,
  },
  selectionControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  controlButtonText: {
    fontWeight: '600',
  },
  divideButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  divideButtonText: {
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  memberSection: {
    flex: 1,
    paddingHorizontal: 4,
  },
  memberList: {
    flex: 1,
    paddingTop: 8,
  },
  memberItem: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  memberContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmark: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    fontWeight: '600',
  },
  teamList: {
    flex: 1,
  },
  teamContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  teamMember: {
    fontSize: 16,
    marginBottom: 4,
  },
});
