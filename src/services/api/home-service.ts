import apiClient from './api-client';

export const homeService = {
  getHomeConfig: async () => {
    const response = await apiClient.get('/home');
    return response.data;
  }
};
