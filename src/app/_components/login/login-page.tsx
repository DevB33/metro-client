import { css, cva } from '@/../styled-system/css';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
});

const colorBoxs = css({
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
  fontFamily: 'Noto Sans KR',
  fontSize: 'xxl',
  fontWeight: 'black',
  height: '7.5rem',
  marginBottom: '2.5rem',
});

const policy = css({
  display: 'flex',
  gap: '0.75rem',
  color: 'gray',
});

const policyButton = css({
  fontFamily: 'Noto Sans KR',
  fontSize: 'md',
  fontWeight: 'medium',
  color: 'gray',
  cursor: 'pointer',
});

const LoginPage = () => {
  return (
    <div className={container}>
      <div className={colorBoxs}>
        <div className={colorBox({ color: 'lineOne' })} />
        <div className={colorBox({ color: 'lineTwo' })} />
        <div className={colorBox({ color: 'lineThree' })} />
        <div className={colorBox({ color: 'lineFour' })} />
        <div className={colorBox({ color: 'lineFive' })} />
        <div className={colorBox({ color: 'lineSix' })} />
      </div>
      <div className={title}>METRO</div>
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

export default LoginPage;
