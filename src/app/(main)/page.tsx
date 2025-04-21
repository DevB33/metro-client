import { css } from '@/../styled-system/css';
import LineChart from './_components/chart/chart';

const homePage = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
  gap: 'base',
});

const welcomeBanner = css({
  fontSize: 'lg',
});

const visualContainer = css({
  width: '80%',
  height: '60%',
});

const Home = () => {
  return (
    <div className={homePage}>
      <div className={welcomeBanner}>김기원 님, 안녕하세요.</div>
      <div className={visualContainer}>
        <LineChart width={1300} height={800} />
      </div>
    </div>
  );
};

export default Home;
