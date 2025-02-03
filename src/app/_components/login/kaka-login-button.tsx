'use client';

import Image from 'next/image';
import { css } from '@/../styled-system/css';

const kakaoButton = css({
  fontSize: 'md',
  fontWeight: 'medium',
  display: 'flex',
  width: '25rem',
  height: '4rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1.25rem',
  backgroundColor: '#FFEB3B',
  borderRadius: '0.5rem',
  boxShadow: 'loginButton',
  cursor: 'pointer',
});

const KakaoLoginButton = () => {
  const handleKakaoLogin = () => {
    window.location.href =
      'https://kauth.kakao.com/oauth/authorize?client_id=4d2facf5f4280bc1079b2bc3e4cd5b8d&redirect_uri=http://localhost:3000/auth/callback/kakao&response_type=code&scope=profile_nickname,account_email,profile_image';
  };

  return (
    <div>
      <button type="button" className={kakaoButton} onClick={handleKakaoLogin}>
        <Image src="/images/kakao_logo.png" alt="카카오 로고" height={50} width={50} />
        Continue with Kakao
      </button>
    </div>
  );
};

export default KakaoLoginButton;
