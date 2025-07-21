'use client';

import { useEffect } from 'react';
import { redirect, useParams, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { css } from '@/../styled-system/css';

import { TOAST_ERRORMESSAGE, TOAST_SUCCESSMESSAGE } from '@/constants/toast-message';

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const { provider } = useParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ provider, authorizationCode: code, state }),
        });

        if (response.status !== 200) {
          throw new Error('Failed to login');
        }
        toast.success(TOAST_SUCCESSMESSAGE.Login);
      } catch (error) {
        // eslint-disable-next-line no-console
        toast.error(TOAST_ERRORMESSAGE.Login);
      } finally {
        redirect('/');
      }
    })();
  }, [code, state, provider]);

  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}>
        <div className={css({ fontSize: 'lg', textAlign: 'center' })}>We are logging you in</div>
        <div className={css({ fontSize: 'md', textAlign: 'center' })}>Don't refresh the page</div>
      </div>
    </div>
  );
};

export default AuthCallback;
