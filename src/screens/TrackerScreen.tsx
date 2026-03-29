import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {searchTransaction, Transaction} from '../services/api';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeColor,
  getStatusIcon,
} from '../utils/helpers';

const TrackerScreen = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!referenceNo.trim()) {
      Alert.alert('Error', 'Masukkan nomor referensi');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchTransaction(referenceNo.trim());
      setTransaction(data);
    } catch (error: any) {
      setTransaction(null);
      Alert.alert('Error', error.message || 'Transaksi tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = transaction
    ? getStatusBadgeColor(transaction.status)
    : null;
  const statusIcon = transaction ? getStatusIcon(transaction.status) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari Transaksi</Text>
        <Text style={styles.headerSubtitle}>
          Masukkan nomor referensi untuk melihat status transaksi Anda
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Search Card */}
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nomor Referensi"
              placeholderTextColor="#9CA3AF"
              value={referenceNo}
              onChangeText={setReferenceNo}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[
                styles.searchButton,
                loading && styles.searchButtonDisabled,
              ]}
              onPress={handleSearch}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Cari</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Result */}
        {transaction && statusColors ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Detail Transaksi</Text>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: statusColors.backgroundColor},
                ]}>
                <Text style={styles.statusIcon}>{statusIcon}</Text>
                <Text style={[styles.statusText, {color: statusColors.color}]}>
                  {transaction.status?.toUpperCase() || 'UNKNOWN'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference No</Text>
              <Text style={styles.detailValue}>
                {transaction.reference_no || transaction.trx_id}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Merchant ID</Text>
              <Text style={styles.detailValue}>{transaction.merchant_id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValueHighlight}>
                {formatCurrency(transaction.amount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal</Text>
              <Text style={styles.detailValue}>
                {formatDate(transaction.transaction_date)}
              </Text>
            </View>

            {transaction.paid_date && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dibayar</Text>
                <Text style={styles.detailValue}>
                  {formatDate(transaction.paid_date)}
                </Text>
              </View>
            )}
          </View>
        ) : searched && !loading ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
            </View>
            <Text style={styles.emptyText}>Transaksi tidak ditemukan</Text>
            <Text style={styles.emptySubtext}>
              Pastikan nomor referensi sudah benar
            </Text>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
            </View>
            <Text style={styles.emptyText}>
              Cari transaksi untuk melihat detailnya
            </Text>
          </View>
        )}
      </ScrollView>
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
    lineHeight: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  searchButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  detailValueHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default TrackerScreen;
