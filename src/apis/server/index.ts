import axios, { AxiosInstance } from 'axios';
import { cookies } from 'next/headers';

export async function getInstance(): Promise<AxiosInstance> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

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
