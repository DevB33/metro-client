import { css } from '@/../styled-system/css';
import { JSX } from 'react';

interface ITab {
  icon: JSX.Element;
  title: string;
  onClick?: () => void;
}

const tabContainer = css({
  display: 'flex',
  flexDirection: 'row',
  height: '2.5rem',
  alignItems: 'center',
  mx: 'tiny',
  px: 'tiny',
  gap: 'tiny',
  cursor: 'pointer',

  _hover: {
    borderRadius: '0.5rem',
    backgroundColor: 'gray',
  },
});

const tabIcon = css({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
});

const tabTitle = css({
  fontSize: 'md',
  userSelect: 'none',
});

const TabSection = ({ icon, title, onClick }: ITab) => {
  return (
    <div className={tabContainer} onClick={onClick}>
      <div className={tabIcon}>{icon}</div>
      <div className={tabTitle}>{title}</div>
    </div>
  );
};

export default TabSection;
