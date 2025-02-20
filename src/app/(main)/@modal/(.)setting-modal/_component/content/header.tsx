import { css } from '@/../styled-system/css';
import { JSX } from 'react';

interface IHeader {
  icon: JSX.Element;
  title: string;
}

const headerConatiner = css({
  display: 'flex',
  flexDirection: 'row',
  height: '3.5rem',
  alignItems: 'center',
  px: 'small',
  gap: 'tiny',
});

const headerIcon = css({
  width: '2rem',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
});

const headerTitle = css({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  userSelect: 'none',
});

const Header = ({ icon, title }: IHeader) => {
  return (
    <div className={headerConatiner}>
      <div className={headerIcon}>{icon}</div>
      <div className={headerTitle}>{title}</div>
    </div>
  );
};

export default Header;
