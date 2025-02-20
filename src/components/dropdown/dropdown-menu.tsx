import { ReactNode } from 'react';
import { css, cx } from '@/../styled-system/css';

interface IDropDownMenuProps {
  children: ReactNode;
  isOpen: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const dropdownMenuContainer = css({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  width: '10rem',
  backgroundColor: 'white',
  borderRadius: '0.3rem',
  boxShadow: 'dropDown',
  px: '0.2rem',
  py: '0.2rem',
  gap: '0.1rem',
});

const DropDownMenu = ({ children, isOpen, top, left, right, bottom }: IDropDownMenuProps) => {
  const menuPositionStyle = css({ top, left, right, bottom });

  return isOpen && <div className={cx(menuPositionStyle, dropdownMenuContainer)}>{children}</div>;
};

export default DropDownMenu;
