import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions, Transaction, ApiResponse } from '../services/api';
import { formatCurrency, formatDate, getStatusBadgeColor, getStatusIcon } from '../utils/helpers';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionId: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
  transactionMerchant: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

const HomeScreen = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = async (page: number = 1) => {
    try {
      setError('');
      const response = await getTransactions(page);
      setData(response.data || []);
      setMeta(response.meta);
    } catch (err) {
      setError('Gagal memuat transaksi. Pastikan server berjalan di localhost:8080');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions(1);
  };

  const filteredData = data.filter((item) => {
    if (!filter) return true;
    const searchLower = filter.toLowerCase();
    return (
      item.reference_no?.toLowerCase().includes(searchLower) ||
      item.merchant_id?.toLowerCase().includes(searchLower) ||
      item.trx_id?.toLowerCase().includes(searchLower) ||
      item.status?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: meta.total,
    success: data.filter((t) => t.status?.toUpperCase() === 'SUCCESS').length,
    pending: data.filter((t) => t.status?.toUpperCase() === 'PENDING').length,
    failed: data.filter((t) => t.status?.toUpperCase() === 'FAILED').length,
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionRow}>
        <Text style={styles.transactionId} numberOfLines={1}>
          {item.reference_no || 'N/A'}
        </Text>
        <Text style={styles.transactionAmount}>{formatCurrency(item.amount)}</Text>
      </View>
      <Text style={styles.transactionMerchant}>{item.merchant_id}</Text>
      <View style={styles.transactionFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBadgeColor(item.status).backgroundColor },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusBadgeColor(item.status).color }]}>
            {getStatusIcon(item.status)} {item.status || 'Unknown'}
          </Text>
        </View>
        <Text style={styles.transactionDate}>{formatDate(item.transaction_date)}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.emptyText}>Memuat transaksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Semua Transaksi</Text>
        <Text style={styles.headerSubtitle}>
          Lihat daftar lengkap semua transaksi Anda
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statsContainer}
      >
        <View style={[styles.statCard, { backgroundColor: '#dbeafe' }]}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={[styles.statValue, { color: '#2563eb' }]}>{stats.total}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
          <Text style={styles.statLabel}>Sukses</Text>
          <Text style={[styles.statValue, { color: '#16a34a' }]}>{stats.success}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={[styles.statValue, { color: '#ca8a04' }]}>{stats.pending}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
          <Text style={styles.statLabel}>Gagal</Text>
          <Text style={[styles.statValue, { color: '#dc2626' }]}>{stats.failed}</Text>
        </View>
      </ScrollView>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari transaksi..."
            value={filter}
            onChangeText={setFilter}
            placeholderTextColor="#cbd5e1"
          />
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>
            {refreshing ? 'Refresh...' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => loadTransactions(1)}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && filteredData.length === 0 ? (
        <View style={[styles.container, styles.centerContainer]}>
          <Ionicons name="document-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>
            {filter ? 'Tidak ada transaksi yang cocok' : 'Tidak ada transaksi'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id || item.reference_no || Math.random().toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 16 }}
          scrollEnabled={true}
        />
      )}
    </View>
  );
};

export default HomeScreen;
