'use client';

import { css } from '@/../styled-system/css';
import AccountIcon from '@/icons/account-icon';
import { redirect } from 'next/navigation';

const guestIconStyle = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50px',
  height: '50px',
});

const guestTextStyle = css({
  width: '10.3rem',
  textAlign: 'start',
  color: 'white',
});

const guestButton = css({
  fontSize: 'md',
  fontWeight: 'medium',
  display: 'flex',
  width: '25rem',
  height: '4rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.25rem',
  borderRadius: '0.5rem',
  boxShadow: 'loginButton',
  cursor: 'pointer',
  backgroundColor: 'gray',
});

const GuestLoginButton = () => {
  const handleGuestLogin = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/guest-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    redirect('/');
  };

  return (
    <div>
      <button type="button" className={guestButton} onClick={handleGuestLogin}>
        <div className={guestIconStyle}>
          <AccountIcon width="32" height="32" />
        </div>
        <span className={guestTextStyle}>Continue as Guest</span>
      </button>
    </div>
  );
};

export default GuestLoginButton;
