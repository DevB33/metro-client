// eslint-disable-next-line
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const setCookieHeader = response.headers.get('set-cookie') || '';

    return new Response('Login', {
      status: response.status,
      headers: { 'Set-Cookie': setCookieHeader },
    });
  } catch (error) {
    return new Response('Login failed', {
      status: 500,
    });
  }
}
