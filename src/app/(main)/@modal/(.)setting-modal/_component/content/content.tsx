import { css } from '@/../styled-system/css';

import AccountIcon from '@/icons/account-icon';
import SettingIcon2 from '@/icons/setting-icon2';
import { JSX } from 'react';
import Header from './header';
import ProfileSettingPage from './profile-setting-page';
import SettingPage from './setting-page';

interface IModalContent {
  tab: number;
}

const modalContentContainer = css({
  display: 'flex',
  flexDirection: 'column',
});

const tabConfig: Record<number, { icon: JSX.Element; title: string; component: JSX.Element }> = {
  1: {
    icon: <AccountIcon width="32" height="32" />,
    title: '내 계정',
    component: <ProfileSettingPage />,
  },
  2: {
    icon: <SettingIcon2 width="32" height="32" />,
    title: '설정',
    component: <SettingPage />,
  },
};

const ModalContent = ({ tab }: IModalContent) => {
  const currentTab = tabConfig[tab] || tabConfig[1];

  return (
    <div className={modalContentContainer}>
      <Header icon={currentTab.icon} title={currentTab.title} />
      {currentTab.component}
    </div>
  );
};

export default ModalContent;
