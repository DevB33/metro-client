import Image from 'next/image';
import { css } from '@/../styled-system/css';

const googleButton = css({
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
});

const GoogleLoginButton = () => {
  return (
    <div>
      <button type="button" className={googleButton}>
        <Image src="/images/google_logo.png" alt="구글 로고" height={50} width={50} />
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
