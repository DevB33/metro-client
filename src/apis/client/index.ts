import axios, { AxiosInstance } from 'axios';
import { Cookies } from 'react-cookie';

async function getInstance(): Promise<AxiosInstance> {
  const cookies = new Cookies();
  const accessToken = cookies.get('accessToken');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return instance;
}

export default getInstance;
