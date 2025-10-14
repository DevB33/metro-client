'use client';

import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { css } from '@/../styled-system/css';

const naverButton = css({
  fontSize: 'md',
  fontWeight: 'medium',
  color: 'white',
  display: 'flex',
  width: '25rem',
  height: '4rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.25rem',
  backgroundColor: '#00C73C',
  borderRadius: '0.5rem',
  boxShadow: 'loginButton',
  cursor: 'pointer',
});

const NaverLoginButton = () => {
  const uuid = uuidv4();

  const handleNaverLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_NAVER_AUTH_URL}${uuid}`;
  };

  return (
    <div>
      <button type="button" className={naverButton} onClick={handleNaverLogin}>
        <Image src="/images/naver_logo.png" alt="네이버 로고" height={50} width={50} />
        Continue with Naver
      </button>
    </div>
  );
};

export default NaverLoginButton;
