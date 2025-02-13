import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// eslint-disable-next-line
export async function POST(request: Request) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return new Response('Unauthorized: No access token provided', {
        status: 401,
      });
    }

    const { parentId } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        parentId,
      }),
    });
    revalidateTag('getSidebarList');

    const data = await response.json();

    return new Response(JSON.stringify({ id: data.id }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Documents Create failed', {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookie = await cookies();
    const accessToken = cookie.get('accessToken')?.value;

    if (!accessToken) {
      return new Response('Unauthorized: No access token provided', {
        status: 401,
      });
    }

    const { parentId } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/${parentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    revalidateTag('getSidebarList');

    console.log(response);

    if (response.ok) {
      return new Response('Document deleted successfully', {
        status: 200,
      });
    }
    const errorData = await response.json();
    return new Response(errorData.message || 'Failed to delete document', {
      status: response.status,
    });
  } catch (error) {
    return new Response('Documents Create failed', {
      status: 500,
    });
  }
}
