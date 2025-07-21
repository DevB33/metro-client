import { ReactNode } from 'react';
import { css } from '@/../styled-system/css';
import useClickOutside from '@/hooks/useClickOutside';

import DropDownItem from './dropdown-item';
import DropDownMenu from './dropdown-menu';

const DropDown = ({ children, handleClose }: IDropDownProps) => {
  const dropDownRef = useClickOutside(handleClose);

  return (
    <div ref={dropDownRef} className={dropdownContainer}>
      {children}
    </div>
  );
};

DropDown.Item = DropDownItem;
DropDown.Menu = DropDownMenu;

interface IDropDownProps {
  children: ReactNode;
  handleClose: () => void;
}

const dropdownContainer = css({
  position: 'relative',
});

export default DropDown;
