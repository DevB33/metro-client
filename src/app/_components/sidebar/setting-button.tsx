'use client';

import SettingIcon from '@/icons/setting-icon';
import { useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

const buttonContainer = css({
  width: '1.4rem',
  height: '1.4rem',
  borderRadius: '10%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',

  _hover: {
    backgroundColor: 'gray',
  },
});

const SettingButton = () => {
  const router = useRouter();

  const openSettings = () => {
    router.push('/setting-modal');
  };

  return (
    <button className={buttonContainer} type="button" onClick={openSettings}>
      <SettingIcon color="gray" />
    </button>
  );
};

export default SettingButton;
