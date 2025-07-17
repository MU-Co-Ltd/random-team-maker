import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TeamDivisionResult } from '@/types';
import { historyStorage } from '@/utils/storage';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HistoryTab() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [history, setHistory] = useState<TeamDivisionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TeamDivisionResult | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await historyStorage.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (result: TeamDivisionResult) => {
    setSelectedResult(result);
    setShowDetail(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          読み込み中...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            チーム分け履歴
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
            履歴数: {history.length}件
          </Text>
        </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
            まだチーム分けの履歴がありません
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text + '40' }]}>
            「チーム分け」タブでチーム分けを実行してください
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.historyItem, { borderColor: colors.text + '20' }]}
              onPress={() => viewDetails(item)}
            >
              <View style={styles.historyHeader}>
                <Text style={[styles.historyDate, { color: colors.text }]}>
                  {item.createdAt.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={[styles.historyInfo, { color: colors.text + '80' }]}>
                  {item.participants.length}人 → {item.teams.length}チーム
                </Text>
              </View>
              <Text style={[styles.historyDetails, { color: colors.text + '60' }]}>
                チーム人数: {item.teamSize}人
              </Text>
              <View style={styles.teamsPreview}>
                {item.teams.slice(0, 3).map((team, index) => (
                  <Text key={index} style={[styles.teamPreview, { color: colors.text + '80' }]}>
                    チーム{index + 1}: {team.map(m => m.name).join(', ')}
                  </Text>
                ))}
                {item.teams.length > 3 && (
                  <Text style={[styles.moreTeams, { color: colors.text + '60' }]}>
                    ...他{item.teams.length - 3}チーム
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          style={styles.historyList}
        />
      )}

      <Modal visible={showDetail} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              チーム分け詳細
            </Text>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.tint }]}
              onPress={() => setShowDetail(false)}
            >
              <Text style={[styles.closeButtonText, { color: colorScheme === 'dark' ? colors.background : 'white' }]}>閉じる</Text>
            </TouchableOpacity>
          </View>

          {selectedResult && (
            <View style={styles.modalContent}>
              <View style={styles.resultInfo}>
                <Text style={[styles.resultDate, { color: colors.text }]}>
                  実行日時: {selectedResult.createdAt.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={[styles.resultStats, { color: colors.text + '80' }]}>
                  参加者: {selectedResult.participants.length}人 / チーム人数: {selectedResult.teamSize}人
                </Text>
              </View>

              <FlatList
                data={selectedResult.teams}
                keyExtractor={(_, index) => `team-${index}`}
                renderItem={({ item: team, index }) => (
                  <View style={[styles.teamDetailContainer, { borderColor: colors.text + '20' }]}>
                    <Text style={[styles.teamDetailTitle, { color: colors.text }]}>
                      チーム {index + 1} ({team.length}人)
                    </Text>
                    {team.map((member, memberIndex) => (
                      <Text
                        key={member.id}
                        style={[styles.teamDetailMember, { color: colors.text + '80' }]}
                      >
                        {memberIndex + 1}. {member.name}
                      </Text>
                    ))}
                  </View>
                )}
                style={styles.teamDetailList}
              />
            </View>
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
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyInfo: {
    fontSize: 14,
  },
  historyDetails: {
    fontSize: 14,
    marginBottom: 8,
  },
  teamsPreview: {
    gap: 4,
  },
  teamPreview: {
    fontSize: 12,
    lineHeight: 16,
  },
  moreTeams: {
    fontSize: 12,
    fontStyle: 'italic',
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
  modalContent: {
    flex: 1,
  },
  resultInfo: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  resultDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultStats: {
    fontSize: 14,
  },
  teamDetailList: {
    flex: 1,
  },
  teamDetailContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  teamDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamDetailMember: {
    fontSize: 14,
    marginBottom: 2,
  },
});
