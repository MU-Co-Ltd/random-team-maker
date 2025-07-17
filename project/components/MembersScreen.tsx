import { Colors } from '@/constants/Colors';
import { useMemberContext } from '@/contexts/MemberContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Member } from '@/types';
import { validateMemberName } from '@/utils/teamUtils';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MembersScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { members, loading, addMember, updateMember, deleteMember } = useMemberContext();
  
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddMember = async () => {
    const error = validateMemberName(newMemberName);
    if (error) {
      Alert.alert('エラー', error);
      return;
    }

    // 重複チェック
    const duplicate = members.find(m => m.name.toLowerCase() === newMemberName.trim().toLowerCase());
    if (duplicate) {
      Alert.alert('エラー', '同じ名前のメンバーが既に存在します');
      return;
    }

    try {
      await addMember(newMemberName);
      setNewMemberName('');
      Alert.alert('成功', 'メンバーを追加しました');
    } catch (error) {
      Alert.alert('エラー', 'メンバーの追加に失敗しました');
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setEditingName(member.name);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    const error = validateMemberName(editingName);
    if (error) {
      Alert.alert('エラー', error);
      return;
    }

    // 重複チェック（編集中のメンバー以外）
    const duplicate = members.find(m => 
      m.id !== editingMember.id && 
      m.name.toLowerCase() === editingName.trim().toLowerCase()
    );
    if (duplicate) {
      Alert.alert('エラー', '同じ名前のメンバーが既に存在します');
      return;
    }

    try {
      const updatedMember = {
        ...editingMember,
        name: editingName.trim(),
        updatedAt: new Date(),
      };
      await updateMember(updatedMember);
      setEditingMember(null);
      setEditingName('');
      Alert.alert('成功', 'メンバー情報を更新しました');
    } catch (error) {
      Alert.alert('エラー', 'メンバー情報の更新に失敗しました');
    }
  };

  const handleDeleteMember = (member: Member) => {
    Alert.alert(
      '確認',
      `${member.name}を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMember(member.id);
              Alert.alert('成功', 'メンバーを削除しました');
            } catch (error) {
              Alert.alert('エラー', 'メンバーの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const renderMemberItem = ({ item }: { item: Member }) => (
    <View style={[styles.memberItem, { borderBottomColor: colors.text + '20' }]}>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.memberDate, { color: colors.text + '60' }]}>
          登録日: {item.createdAt.toLocaleDateString('ja-JP')}
        </Text>
      </View>
      <View style={styles.memberActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditMember(item)}
        >
          <Text style={styles.actionButtonText}>編集</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteMember(item)}
        >
          <Text style={styles.actionButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>読み込み中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>メンバー管理</Text>
        <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
          登録メンバー数: {members.length}
        </Text>
      </View>

      <View style={styles.addSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>新しいメンバーを追加</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { borderColor: colors.text + '30', color: colors.text }]}
            placeholder="名前を入力"
            placeholderTextColor={colors.text + '60'}
            value={newMemberName}
            onChangeText={setNewMemberName}
            maxLength={50}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.tint }]}
            onPress={handleAddMember}
          >
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>
      </View>

      {editingMember && (
        <View style={[styles.editSection, { backgroundColor: colors.background, borderColor: colors.tint }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>編集中: {editingMember.name}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { borderColor: colors.text + '30', color: colors.text }]}
              placeholder="名前を入力"
              placeholderTextColor={colors.text + '60'}
              value={editingName}
              onChangeText={setEditingName}
              maxLength={50}
            />
            <TouchableOpacity
              style={[styles.updateButton, { backgroundColor: colors.tint }]}
              onPress={handleUpdateMember}
            >
              <Text style={styles.addButtonText}>更新</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton]}
              onPress={() => {
                setEditingMember(null);
                setEditingName('');
              }}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.listSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>メンバー一覧</Text>
        {members.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
            まだメンバーが登録されていません
          </Text>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            renderItem={renderMemberItem}
            style={styles.memberList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
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
  addSection: {
    marginBottom: 24,
  },
  editSection: {
    marginBottom: 24,
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  updateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  memberList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  memberDate: {
    fontSize: 12,
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
