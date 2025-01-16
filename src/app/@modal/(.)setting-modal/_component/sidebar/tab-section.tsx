import { css } from '@/../styled-system/css';
import { JSX } from 'react';

interface ITab {
  icon: JSX.Element;
  title: string;
}

const tabContainer = css({
  display: 'flex',
  flexDirection: 'row',
  height: '2.5rem',
  alignItems: 'center',
  mx: 'tiny',
  px: 'tiny',
  gap: 'tiny',
});

const tabIcon = css({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
});

const tabTitle = css({
  fontSize: 'md',
});

const TabSection = ({ icon, title }: ITab) => {
  return (
    <div className={tabContainer}>
      <div className={tabIcon}>{icon}</div>
      <div className={tabTitle}>{title}</div>
    </div>
  );
};

export default TabSection;
