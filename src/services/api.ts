import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Transaction {
  id: string;
  merchant_id: string;
  amount: number;
  trx_id: string;
  partner_reference_no?: string;
  reference_no?: string;
  status?: string;
  transaction_date?: string;
  paid_date?: string;
}

export interface ApiResponse {
  data: Transaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface QRResponse {
  referenceNo: string;
  qrContent: string;
}

export interface PaymentResponse {
  responseMessage: string;
  responseCode?: string;
}

// API Calls
export const getTransactions = async (page: number = 1) => {
  try {
    const response = await apiClient.get<ApiResponse>(
      `/transactions?page=${page}&limit=10`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateSignature = async (type: string, data: any) => {
  try {
    const response = await apiClient.post('/signature', {
      type,
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateQR = async (
  partnerReferenceNo: string,
  merchantId: string,
  trxId: string,
  amount: string,
  signature: string
) => {
  try {
    const response = await apiClient.post<QRResponse>(
      '/qr/generate',
      {
        partnerReferenceNo,
        merchantId,
        trx_id: trxId,
        amount: {
          value: amount,
          currency: 'IDR',
        },
      },
      {
        headers: {
          'X-SIGNATURE': signature,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const processPayment = async (
  referenceNo: string,
  amount: string,
  signature: string
) => {
  try {
    const response = await apiClient.post<PaymentResponse>(
      '/qr/payment',
      {
        originalReferenceNo: referenceNo,
        transactionStatusDesc: 'SUCCESS',
        paidTime: new Date().toISOString(),
        amount: {
          value: amount,
          currency: 'IDR',
        },
      },
      {
        headers: {
          'X-SIGNATURE': signature,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchTransaction = async (referenceNo: string) => {
  try {
    const response = await apiClient.get<Transaction>(
      `/tracker/${referenceNo}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
