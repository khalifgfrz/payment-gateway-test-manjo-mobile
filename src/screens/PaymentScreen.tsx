import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { generateSignature, processPayment, PaymentResponse } from '../services/api';

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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
  tipsContainer: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
  },
  tipsText: {
    color: '#0c4a6e',
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  tipsTitle: {
    fontWeight: '700',
  },
});

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
        sig.signature
      );

      setMessage(paymentResult);
      setForm({ referenceNo: '', amount: '' });
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memproses pembayaran'
      );
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message?.responseCode === '0000';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Simulasi Pembayaran</Text>
        <Text style={styles.headerSubtitle}>
          Proses pembayaran untuk referensi transaksi yang sudah dibuat
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference No *</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nomor referensi"
              value={form.referenceNo}
              onChangeText={(value) => setForm({ ...form, referenceNo: value })}
              placeholderTextColor="#cbd5e1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (IDR) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan jumlah pembayaran"
              value={form.amount}
              onChangeText={(value) => setForm({ ...form, amount: value })}
              keyboardType="numeric"
              placeholderTextColor="#cbd5e1"
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
              ]}
            >
              <Ionicons
                name={isSuccess ? 'checkmark-circle' : 'warning'}
                size={20}
                color={isSuccess ? '#166534' : '#b45309'}
              />
              <View style={styles.successMessage}>
                <Text
                  style={[
                    styles.successTitle,
                    { color: isSuccess ? '#166534' : '#b45309' },
                  ]}
                >
                  {message.responseMessage}
                </Text>
                {message.responseCode && (
                  <Text
                    style={[
                      styles.successText,
                      { color: isSuccess ? '#166534' : '#b45309' },
                    ]}
                  >
                    Code: {message.responseCode}
                  </Text>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Proses Pembayaran</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={[styles.tipsText, styles.tipsTitle]}>💡 Tips: </Text>
          <Text style={styles.tipsText}>
            Pastikan Reference No sudah dibuat terlebih dahulu melalui halaman
            Generate QR
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;
