import { cookies } from 'next/headers';

// eslint-disable-next-line
export async function POST() {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const setCookieHeader = response.headers.get('set-cookie') || '';

    return new Response('Logout', {
      status: response.status,
      headers: { 'Set-Cookie': setCookieHeader },
    });
  } catch (error) {
    return new Response('Logout failed', {
      status: 500,
    });
  }
}
