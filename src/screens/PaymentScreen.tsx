import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  processPayment,
  generateSignature,
  PaymentResponse,
} from '../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatCurrency} from '../utils/helpers';

const PaymentScreen = () => {
  const [form, setForm] = useState({
    referenceNo: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<PaymentResponse | null>(null);

  const validateForm = (): boolean => {
    if (!form.referenceNo.trim()) {
      setError('Reference No wajib diisi');
      return false;
    }
    if (!form.amount.trim()) {
      setError('Amount wajib diisi');
      return false;
    }
    if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError('Amount harus berupa angka positif');
      return false;
    }
    return true;
  };

  const handlePay = async () => {
    setError('');
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sig = await generateSignature('payment', {
        originalReferenceNo: form.referenceNo,
        amountValue: form.amount,
      });

      const paymentResult = await processPayment(
        form.referenceNo,
        form.amount,
        sig.signature,
      );

      setMessage(paymentResult);
      setForm({referenceNo: '', amount: ''});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message?.responseCode === '0000';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simulasi Pembayaran</Text>
        <Text style={styles.headerSubtitle}>
          Proses pembayaran untuk referensi transaksi yang sudah dibuat
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reference No *</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor referensi"
                placeholderTextColor="#9CA3AF"
                value={form.referenceNo}
                onChangeText={value => setForm({...form, referenceNo: value})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (IDR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan jumlah pembayaran"
                placeholderTextColor="#9CA3AF"
                value={form.amount}
                onChangeText={value => setForm({...form, amount: value})}
                keyboardType="numeric"
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="warning" size={16} color="#991b1b" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {message && (
              <View
                style={[
                  styles.successContainer,
                  {
                    backgroundColor: isSuccess ? '#dcfce7' : '#fef3c7',
                    borderColor: isSuccess ? '#86efac' : '#fcd34d',
                  },
                ]}>
                <Ionicons
                  name={isSuccess ? 'checkmark-circle' : 'warning'}
                  size={20}
                  color={isSuccess ? '#166534' : '#b45309'}
                />
                <View style={styles.successMessage}>
                  <Text
                    style={[
                      styles.successTitle,
                      {color: isSuccess ? '#166534' : '#b45309'},
                    ]}>
                    {message.responseMessage}
                  </Text>
                  {message.responseCode && (
                    <Text
                      style={[
                        styles.successText,
                        {color: isSuccess ? '#166534' : '#b45309'},
                      ]}></Text>
                  )}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handlePay}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Proses Pembayaran</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Tips Card */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>Tips:</Text>
            </View>
            <Text style={styles.tipsText}>
              Pastikan Reference No sudah dibuat terlebih dahulu melalui halaman
              Generate QR
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  successContainer: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
  },
  successMessage: {
    flex: 1,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  successText: {
    fontSize: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
  },
  tipsText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 20,
  },
});

export default PaymentScreen;
