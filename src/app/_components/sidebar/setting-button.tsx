'use client';

import SettingIcon from '@/icons/setting-icon';
import { useRouter } from 'next/navigation';

const SettingButton = () => {
  const router = useRouter();

  const openSettings = () => {
    router.push('/setting-modal');
  };

  return (
    <button type="button" onClick={openSettings}>
      <SettingIcon color="gray" />
    </button>
  );
};

export default SettingButton;
