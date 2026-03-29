import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import {generateSignature, generateQR, QRResponse} from '../services/api';

const GenerateQRScreen = () => {
  const [form, setForm] = useState({
    partnerReferenceNo: '',
    merchantId: '',
    trx_id: '',
    amount: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<QRResponse | null>(null);
  const qrRef = React.useRef<any>(null);

  const validateForm = (): boolean => {
    if (!form.partnerReferenceNo.trim()) {
      setError('Partner Reference No wajib diisi');
      return false;
    }
    if (!form.merchantId.trim()) {
      setError('Merchant ID wajib diisi');
      return false;
    }
    if (!form.trx_id.trim()) {
      setError('Transaction ID wajib diisi');
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

  const handleGenerate = async () => {
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sig = await generateSignature('generateQR', {
        partnerReferenceNo: form.partnerReferenceNo,
        merchantId: form.merchantId,
        amountValue: form.amount,
      });

      const qrResult = await generateQR(
        form.partnerReferenceNo,
        form.merchantId,
        form.trx_id,
        form.amount,
        sig.signature,
      );

      setResult(qrResult);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Gagal membuat QR Code',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (qrRef.current) {
        qrRef.current.toDataURL(async (data: string) => {
          const fileName = `QR-${result?.referenceNo || 'Code'}.png`;

          await Share.open({
            url: `data:image/png;base64,${data}`,
            filename: fileName,
            failOnCancel: false,
          });
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengunduh QR Code');
    }
  };

  const handleReset = () => {
    setForm({
      partnerReferenceNo: '',
      merchantId: '',
      trx_id: '',
      amount: '',
    });
    setResult(null);
    setError('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate QR Code</Text>
        <Text style={styles.headerSubtitle}>
          Buat QR code baru untuk transaksi pembayaran
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {!result ? (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Form Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Partner Reference No *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: PRN-2024-001"
                  placeholderTextColor="#9CA3AF"
                  value={form.partnerReferenceNo}
                  onChangeText={value =>
                    setForm({...form, partnerReferenceNo: value})
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Merchant ID *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: MERCHANT123"
                  placeholderTextColor="#9CA3AF"
                  value={form.merchantId}
                  onChangeText={value => setForm({...form, merchantId: value})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Transaction ID *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: TRX-2024-001"
                  placeholderTextColor="#9CA3AF"
                  value={form.trx_id}
                  onChangeText={value => setForm({...form, trx_id: value})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount (IDR) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ex: 100000"
                  placeholderTextColor="#9CA3AF"
                  value={form.amount}
                  onChangeText={value => setForm({...form, amount: value})}
                  keyboardType="numeric"
                />
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  loading && styles.submitButtonDisabled,
                ]}
                onPress={handleGenerate}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Generate QR Code</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>QR Code Generated</Text>

              <View style={styles.qrContainer}>
                <QRCode
                  getRef={(ref: any) => (qrRef.current = ref)}
                  value={result.qrContent}
                  size={200}
                  color="#000000"
                  backgroundColor="#ffffff"
                />
              </View>

              <View style={styles.referenceContainer}>
                <Text style={styles.referenceLabel}>Reference No</Text>
                <Text style={styles.referenceValue} numberOfLines={2}>
                  {result.referenceNo}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleDownload}>
                  <Text style={styles.submitButtonText}>Download QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleReset}>
                  <Text style={styles.secondaryButtonText}>
                    Generate Another
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
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
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
  },
  referenceContainer: {
    marginBottom: 20,
  },
  referenceLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionButtons: {
    gap: 12,
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default GenerateQRScreen;
