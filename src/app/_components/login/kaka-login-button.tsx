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
  return (
    <div>
      <button type="button" className={kakaoButton}>
        <Image src="/images/kakao_logo.png" alt="카카오 로고" height={50} width={50} />
        Continue with Kakao
      </button>
    </div>
  );
};

export default KakaoLoginButton;
