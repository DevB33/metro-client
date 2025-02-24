import SettingIcon2 from '@/icons/setting-icon2';
import AccountIcon from '@/icons/account-icon';
import ProfileSection from './profile-section';
import TabSection from './tab-section';

interface ISideBar {
  onClick: (i: number) => void;
}

const SideBar = ({ onClick }: ISideBar) => {
  return (
    <>
      <ProfileSection />
      <TabSection onClick={() => onClick(1)} icon={<AccountIcon width="20" height="20" />} title="내 계정" />
      <TabSection onClick={() => onClick(2)} icon={<SettingIcon2 width="20" height="20" />} title="설정" />
    </>
  );
};

export default SideBar;
