'use client';

import { css } from '@/../styled-system/css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ModalContent from './_component/content/content';
import SideBar from './_component/sidebar/sidebar';

const overlayStyles = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // 어둡게 처리
  zIndex: 999,
});

const settingModalContainer = css({
  width: '52rem',
  height: '32rem',
  position: 'absolute',
  top: '50%',
  left: ' 50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '1rem',
  display: 'flex',
  flexDirection: 'row',
  boxShadow: 'settingModal',
  overflow: 'hidden',
  zIndex: 1000,
});

const sideContainer = css({
  zIndex: 1000,
  width: '12rem',
  backgroundColor: '#F1F1F1',
});

const contentContainer = css({
  flex: '1',
  backgroundColor: 'white',
});

const SettingsModal = () => {
  const [tab, setTab] = useState(1);
  const router = useRouter();

  const closeModal = () => {
    router.back(); // 이전 상태로 돌아감
  };

  const handleTab = (i: number) => {
    setTab(i);
  };

  return (
    <>
      <div className={overlayStyles} onClick={closeModal} />
      <div className={settingModalContainer}>
        <div className={sideContainer}>
          <SideBar onClick={handleTab} />
        </div>
        <div className={contentContainer}>
          <ModalContent tab={tab} />
        </div>
      </div>
    </>
  );
};

export default SettingsModal;
