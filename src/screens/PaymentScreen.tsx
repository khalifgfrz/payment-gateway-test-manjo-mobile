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
import {processPayment, generateSignature} from '../services/api';
import {formatCurrency} from '../utils/helpers';

const PaymentScreen = () => {
  const [referenceNo, setReferenceNo] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!referenceNo.trim()) {
      Alert.alert('Error', 'Reference No wajib diisi');
      return false;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('Error', 'Amount harus berupa angka yang valid');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Generate signature first
      const signatureResponse = await generateSignature('payment', {
        referenceNo,
        amount,
      });

      // Then process payment
      const response = await processPayment(
        referenceNo,
        amount,
        signatureResponse.signature,
      );

      Alert.alert(
        'Sukses',
        `Pembayaran berhasil diproses!\n\nPesan: ${response.responseMessage}\nAmount: ${formatCurrency(Number(amount))}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setReferenceNo('');
              setAmount('');
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

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
                value={referenceNo}
                onChangeText={setReferenceNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (IDR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan jumlah pembayaran"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
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
