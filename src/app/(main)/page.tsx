import { css } from '@/../styled-system/css';

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
  backgroundColor: 'grey',
});

const Home = () => {
  return (
    <div className={homePage}>
      <div className={welcomeBanner}>김기원 님, 안녕하세요.</div>
      <div className={visualContainer}>sdf</div>
    </div>
  );
};

export default Home;
