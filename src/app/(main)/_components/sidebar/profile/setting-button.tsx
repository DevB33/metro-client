'use client';

import { useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

import LogoutIcon from '@/icons/logout-icon';

const SettingButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      router.push('/login');
    }
  };

  return (
    <button className={buttonContainer} type="button" onClick={handleLogout}>
      <LogoutIcon />
    </button>
  );
};

const buttonContainer = css({
  width: '1.4rem',
  height: '1.4rem',
  borderRadius: '10%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',

  _hover: {
    backgroundColor: 'gray',
  },
});

export default SettingButton;
