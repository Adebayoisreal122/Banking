import axios from 'axios';

// API base URL - change this to match your backend
// export const API_URL = 'http://localhost:3000/api';

export const API_URL = 'https://banking-backend-b7f7.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally (token expiration, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or invalid token
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🔒 Token expired or invalid - logging out');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: async (data: { email: string; password: string; fullName: string; phone?: string }) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },
  
  signin: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/signin', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
  updateProfile: async (data: { fullName: string; email: string; phone: string }) => {
  const response = await apiClient.patch('/auth/profile', data);
  return response.data;
},

changePassword: async (data: { currentPassword: string; newPassword: string }) => {
  const response = await apiClient.patch('/auth/change-password', data);
  return response.data;
},

uploadAvatar: async (formData: FormData) => {
  const response = await apiClient.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
};



// Account API calls
export const accountAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/accounts/dashboard');
    return response.data;
  },
  
  getAccounts: async () => {
    const response = await apiClient.get('/accounts');
    return response.data;
  },
  
  getAccountById: async (id: string) => {
    const response = await apiClient.get(`/accounts/${id}`);
    return response.data;
  },
};

// Transaction API calls
export const transactionAPI = {
  transfer: async (data: { fromAccountId: string; toAccountNumber: string; amount: number; description?: string }) => {
    const response = await apiClient.post('/transactions/transfer', data);
    return response.data;
  },
  
  withdraw: async (data: { accountId: string; amount: number; description?: string }) => {
    const response = await apiClient.post('/transactions/withdraw', data);
    return response.data;
  },
  
  deposit: async (data: { accountId: string; amount: number; description?: string }) => {
    const response = await apiClient.post('/transactions/deposit', data);
    return response.data;
  },
  
  getTransactions: async (accountId?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (accountId) params.append('accountId', accountId);
    if (limit) params.append('limit', limit.toString());
    
    const response = await apiClient.get(`/transactions?${params.toString()}`);
    return response.data;
  },
};

// Loan API calls
export const loanAPI = {
  apply: async (data: { accountId: string; loanAmount: number; termMonths: number }) => {
    const response = await apiClient.post('/loans/apply', data);
    return response.data;
  },
  
  getLoans: async () => {
    const response = await apiClient.get('/loans');
    return response.data;
  },
  
  getLoanById: async (id: string) => {
    const response = await apiClient.get(`/loans/${id}`);
    return response.data;
  },

    repay: async (data: { loanId: string; amount: number; accountId: string }) => {
    const response = await apiClient.post('/loans/repay', data);
    return response.data;
  },

};

// Bill Payment API calls
export const billAPI = {
  pay: async (data: { accountId: string; billerName: string; amount: number; referenceNumber?: string }) => {
    const response = await apiClient.post('/bills/pay', data);
    return response.data;
  },
  
  getBillPayments: async () => {
    const response = await apiClient.get('/bills');
    return response.data;
  },
};

export default apiClient;