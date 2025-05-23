import { ReactNode } from 'react';
import { css } from '@/../styled-system/css';
import ReactDOM from 'react-dom';

interface IDropDownMenuProps {
  children: ReactNode;
  isOpen: boolean;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
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
  zIndex: '10000',
});

const DropDownMenu = ({ children, isOpen, top, left, right, bottom }: IDropDownMenuProps) => {
  return isOpen
    ? ReactDOM.createPortal(
        <div className={dropdownMenuContainer} style={{ top, left, right, bottom }}>
          {children}
        </div>,
        document.body,
      )
    : null;
};
export default DropDownMenu;
