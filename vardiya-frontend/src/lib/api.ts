const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  },
};

export const departmentService = {
  getAll: async () => {
    return api.get('/departments');
  },
};

export const userService = {
  getAll: async () => {
    return api.get('/users');
  },
};

export const shiftService = {
  create: async (shiftData: any) => {
    return api.post('/shifts', { shift: shiftData });
  },
};