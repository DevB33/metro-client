'use client';

import useSWR from 'swr';
import { css } from '@/../styled-system/css';

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
  const { data: userInfo } = useSWR(`userInfo`);

  return (
    <div className={homePage}>
      <div className={welcomeBanner}>{userInfo?.name} 님, 안녕하세요.</div>
      <div className={visualContainer}>
        <ResponseWrapper />
      </div>
    </div>
  );
};

export default Home;
