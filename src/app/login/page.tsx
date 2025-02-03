import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { css, cva } from '@/../styled-system/css';

import KakaoLoginButton from './_components/kakao-login-button';
import NaverLoginButton from './_components/naver-login-button';
import GoogleLoginButton from './_components/google-login-button';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const colorBoxContainer = css({
  display: 'flex',
  gap: '1.5rem',
});

const colorBox = cva({
  base: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
  },
  variants: {
    color: {
      lineOne: { backgroundColor: 'lineOne' },
      lineTwo: { backgroundColor: 'lineTwo' },
      lineThree: { backgroundColor: 'lineThree' },
      lineFour: { backgroundColor: 'lineFour' },
      lineFive: { backgroundColor: 'lineFive' },
      lineSix: { backgroundColor: 'lineSix' },
    },
  },
});

const title = css({
  fontSize: 'xxl',
  fontWeight: 'black',
  height: '7.5rem',
  marginBottom: '2.5rem',
});

const buttonContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'base',
  marginBottom: '6.75rem',
});

const policy = css({
  display: 'flex',
  gap: '0.75rem',
  color: 'gray',
});

const policyButton = css({
  fontSize: 'md',
  fontWeight: 'medium',
  color: 'gray',
  cursor: 'pointer',
});

const Login = async () => {
  const cookie = await cookies();
  const isLogin = cookie.has('accessToken');

  if (isLogin) {
    redirect('/');
  }

  return (
    <div className={container}>
      <div className={colorBoxContainer}>
        <div className={colorBox({ color: 'lineOne' })} />
        <div className={colorBox({ color: 'lineTwo' })} />
        <div className={colorBox({ color: 'lineThree' })} />
        <div className={colorBox({ color: 'lineFour' })} />
        <div className={colorBox({ color: 'lineFive' })} />
        <div className={colorBox({ color: 'lineSix' })} />
      </div>
      <div className={title}>METRO</div>
      <div className={buttonContainer}>
        <KakaoLoginButton />
        <NaverLoginButton />
        <GoogleLoginButton />
      </div>
      <div className={policy}>
        <button type="button" className={policyButton}>
          이용약관
        </button>{' '}
        <div>|</div>{' '}
        <button type="button" className={policyButton}>
          개인정보 보호 정책
        </button>
      </div>
    </div>
  );
};

export default Login;
