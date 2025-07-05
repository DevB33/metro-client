'use client';

import { css } from '@/../styled-system/css';
import { toast } from 'react-toastify';
import ResponseWrapper from './_components/chart/responsiveWrapper';

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
  const notify = () => toast.error('안녕하세요!');

  return (
    <div className={homePage}>
      <div className={welcomeBanner}>김기원 님, 안녕하세요.</div>
      <button style={{ width: '100vw', height: '5vh', backgroundColor: 'red' }} onClick={notify} />
      <div className={visualContainer}>
        <ResponseWrapper />
      </div>
    </div>
  );
};

export default Home;
