// eslint-disable-next-line
export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  const setCookieHeader = response.headers.get('set-cookie');

  return new Response('Login successful', {
    status: 200,
    headers: { 'Set-Cookie': setCookieHeader },
  });
}
