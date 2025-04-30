import { toast } from "@/components/ui/sonner";

const API_URL = "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data?.message || 'An error occurred';
    toast.error(error);
    throw new Error(error);
  }
  
  return data;
};

// Authentication API calls
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error:', error);
    toast.error('Registration failed. Please check if the server is running.');
    throw error;
  }
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  return handleResponse(response);
};

export const getProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};

// Invoice API calls
export const getInvoices = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};

export const getInvoice = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};

export const createInvoice = async (invoiceData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(invoiceData)
  });
  
  return handleResponse(response);
};

export const updateInvoice = async (id, invoiceData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(invoiceData)
  });
  
  return handleResponse(response);
};

export const deleteInvoice = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};

export const downloadInvoicePdf = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    // Create a fetch request to get the PDF file
    const response = await fetch(`${API_URL}/invoices/${id}/pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to download PDF');
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `invoice-${id}.pdf`;
    
    // Append to the DOM, click the link, and clean up
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('PDF download started');
  } catch (error) {
    console.error('PDF download error:', error);
    toast.error('Failed to download PDF. Please try again.');
  }
};

export const sendInvoiceEmail = async (id) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}/invoices/${id}/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return handleResponse(response);
};
