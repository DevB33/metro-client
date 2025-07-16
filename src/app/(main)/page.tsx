'use client';

import useSWR from 'swr';
import { css } from '@/../styled-system/css';
import { ToastContainer } from 'react-toastify';

import SWR_KEYS from '@/constants/swr-keys';
import ResponseWrapper from './_components/chart/responsiveWrapper';

const Home = () => {
  const { data: userInfo } = useSWR(SWR_KEYS.USER_INFO);

  return (
    <div className={container}>
      <ToastContainer autoClose={1500} />
      <div className={welcomeBanner}>{userInfo?.name} 님, 안녕하세요.</div>
      <div className={chartContainer}>
        <ResponseWrapper />
      </div>
    </div>
  );
};

const container = css({
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

const chartContainer = css({
  width: '80%',
  height: '60%',
});

export default Home;
