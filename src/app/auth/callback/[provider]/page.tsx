'use client';

import { redirect, useParams, useSearchParams } from 'next/navigation';
import { css } from '@/../styled-system/css';
import { useEffect } from 'react';

const AuthCallback = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const { provider } = useParams();

  console.log('a');

  useEffect(() => {
    (async () => {
      await fetch(`/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, authorizationCode: code, state }),
        credentials: 'include',
      });

      redirect('/');
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
