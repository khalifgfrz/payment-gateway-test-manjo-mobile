import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {searchTransaction, Transaction} from '../services/api';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeColor,
  getStatusIcon,
} from '../utils/helpers';

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
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
});

const TrackerScreen = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Transaction | null>(null);

  const handleSearch = async () => {
    if (!referenceNo.trim()) {
      setError('Masukkan nomor referensi');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await searchTransaction(referenceNo);
      setResult(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Transaksi Tidak Ditemukan');
      } else {
        setError(err.response?.data?.message || 'Gagal mencari transaksi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cari Transaksi</Text>
        <Text style={styles.headerSubtitle}>
          Masukkan nomor referensi untuk melihat status transaksi Anda
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nomor Referensi"
            value={referenceNo}
            onChangeText={setReferenceNo}
            placeholderTextColor="#cbd5e1"
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>Cari</Text>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Memproses...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Detail Transaksi</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusBadgeColor(result.status)
                      .backgroundColor,
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {color: getStatusBadgeColor(result.status).color},
                  ]}>
                  {getStatusIcon(result.status)} {result.status || 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference No</Text>
              <Text style={styles.detailValue}>
                {result.reference_no || '-'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Merchant ID</Text>
              <Text style={styles.detailValue}>
                {result.merchant_id || '-'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text
                style={[styles.detailValue, {color: '#2563eb', fontSize: 16}]}>
                {formatCurrency(result.amount) || '-'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{result.trx_id || '-'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Partner Ref</Text>
              <Text style={styles.detailValue}>
                {result.partner_reference_no || '-'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>{result.status || '-'}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(result.transaction_date)}
              </Text>
            </View>

            <View>
              <Text style={styles.detailLabel}>Paid Date</Text>
              <Text style={styles.detailValue}>
                {formatDate(result.paid_date)}
              </Text>
            </View>
          </View>
        )}

        {!loading && !error && !result && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search-outline" size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyText}>
              Cari transaksi untuk melihat detailnya
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TrackerScreen;
