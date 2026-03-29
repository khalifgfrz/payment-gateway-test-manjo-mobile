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
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import {generateSignature, generateQR, QRResponse} from '../services/api';

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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 14,
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
  },
  errorText: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 12,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 12,
  },
  referenceText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  actionButtonsContainer: {
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#cbd5e1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },
});

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
      setError(err.response?.data?.message || 'Gagal membuat QR Code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (qrRef.current) {
        const qrImage = await qrRef.current.toDataURL({type: 'image/png'});
        const fileName = `QR-${result?.referenceNo || 'Code'}.png`;

        await Share.open({
          url: `data:image/png;base64,${qrImage}`,
          filename: fileName,
          failOnCancel: false,
        });
      }
    } catch (error) {
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generate QR Code</Text>
        <Text style={styles.headerSubtitle}>
          Buat QR code baru untuk transaksi pembayaran
        </Text>
      </View>

      <View style={styles.content}>
        {!result ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Form Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Partner Reference No *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: PRN-2024-001"
                value={form.partnerReferenceNo}
                onChangeText={value =>
                  setForm({...form, partnerReferenceNo: value})
                }
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Merchant ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: MERCHANT123"
                value={form.merchantId}
                onChangeText={value => setForm({...form, merchantId: value})}
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transaction ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: TRX-2024-001"
                value={form.trx_id}
                onChangeText={value => setForm({...form, trx_id: value})}
                placeholderTextColor="#cbd5e1"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (IDR) *</Text>
              <TextInput
                style={styles.input}
                placeholder="ex: 100000"
                value={form.amount}
                onChangeText={value => setForm({...form, amount: value})}
                keyboardType="numeric"
                placeholderTextColor="#cbd5e1"
              />
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleGenerate}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Generate QR Code</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>QR Code Generated</Text>

            <View style={styles.qrContainer}>
              <QRCode
                ref={qrRef}
                value={result.qrContent}
                size={200}
                color="#000000"
                backgroundColor="#ffffff"
              />
            </View>

            <View>
              <Text style={styles.referenceText}>Reference No</Text>
              <Text style={styles.referenceValue} numberOfLines={2}>
                {result.referenceNo}
              </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.button} onPress={handleDownload}>
                <Text style={styles.buttonText}>Download QR Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleReset}>
                <Text style={styles.secondaryButtonText}>Generate Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default GenerateQRScreen;
