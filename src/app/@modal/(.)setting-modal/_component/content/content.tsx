import { css } from '@/../styled-system/css';

import AccountIcon from '@/icons/account-icon';
import SettingIcon2 from '@/icons/setting-icon2';
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

const ModalContent = ({ tab }: IModalContent) => {
  return (
    <div className={modalContentContainer}>
      <Header
        icon={
          tab === 1 ? (
            <AccountIcon width="32" height="32" />
          ) : (
            <SettingIcon2 width="32" height="32" />
          )
        }
        title={tab === 1 ? '내 계정' : '설정'}
      />
      {tab === 1 ? <ProfileSettingPage /> : <SettingPage />}
    </div>
  );
};

export default ModalContent;
