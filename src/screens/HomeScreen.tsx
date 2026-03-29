import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getTransactions, Transaction} from '../services/api';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeColor,
  getStatusIcon,
} from '../utils/helpers';

const HomeScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions(1);
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    filterTransactions(text, filter);
  };

  const filterTransactions = (search: string, status: string) => {
    let filtered = transactions;

    if (search) {
      filtered = filtered.filter(
        t =>
          t.reference_no?.toLowerCase().includes(search.toLowerCase()) ||
          t.merchant_id?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(t => t.status?.toUpperCase() === status);
    }

    setFilteredTransactions(filtered);
  };

  const getStats = () => {
    const total = transactions.length;
    const success = transactions.filter(
      t => t.status?.toUpperCase() === 'SUCCESS',
    ).length;
    const pending = transactions.filter(
      t => t.status?.toUpperCase() === 'PENDING',
    ).length;
    const failed = transactions.filter(
      t => t.status?.toUpperCase() === 'FAILED',
    ).length;
    return {total, success, pending, failed};
  };

  const stats = getStats();

  const renderTransaction = ({item}: {item: Transaction}) => {
    const statusColors = getStatusBadgeColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.transactionInfo}>
            <Text style={styles.referenceNo}>
              {item.reference_no || item.trx_id}
            </Text>
            <Text style={styles.merchantId}>{item.merchant_id}</Text>
          </View>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        </View>
        <View style={styles.transactionFooter}>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: statusColors.backgroundColor},
            ]}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={[styles.statusText, {color: statusColors.color}]}>
              {item.status?.toUpperCase() || 'UNKNOWN'}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(item.transaction_date)}</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, {backgroundColor: '#EEF2FF'}]}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={[styles.statValue, {color: '#4F46E5'}]}>
            {stats.total}
          </Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#ECFDF5'}]}>
          <Text style={styles.statLabel}>Sukses</Text>
          <Text style={[styles.statValue, {color: '#10B981'}]}>
            {stats.success}
          </Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#FEF9C3'}]}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, {color: '#F59E0B'}]}>
            {stats.pending}
          </Text>
        </View>
        <View style={[styles.statCard, {backgroundColor: '#FEE2E2'}]}>
          <Text style={styles.statLabel}>Gagal</Text>
          <Text style={[styles.statValue, {color: '#EF4444'}]}>
            {stats.failed}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari transaksi..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
      </View>
      <Text style={styles.emptyText}>Belum ada transaksi</Text>
      <Text style={styles.emptySubtext}>Transaksi akan muncul di sini</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Semua Transaksi</Text>
        <Text style={styles.headerSubtitle}>
          Lihat daftar lengkap semua transaksi Anda
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  refreshButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  referenceNo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  merchantId: {
    fontSize: 12,
    color: '#6B7280',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});

export default HomeScreen;
