'use client';

import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import DropDown from '@/app/(main)/_components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import { useState } from 'react';

const headerConatiner = css({
  boxSizing: 'border-box',
  width: '100%',
  paddingTop: 'small',
  px: 'small',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  userSelect: 'none',
});

const leftItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const rightItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const dropDownButton = css({
  cursor: 'pointer',
});

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openSettingDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeSettingDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className={headerConatiner}>
      <div className={leftItemsConatiner}>
        <LeftArrowIcon />
        <RightArrowIcon />
      </div>
      <div className={rightItemsConatiner}>
        <div>공유</div>
        <div className={dropDownButton} onClick={openSettingDropdown}>
          <HorizonDotIcon />
          <DropDown handleClose={closeSettingDropdown}>
            <DropDown.Menu isOpen={isDropdownOpen} top="0.5rem" right="0">
              <DropDown.Item>
                <TrashIcon />
                삭제하기
              </DropDown.Item>
            </DropDown.Menu>
          </DropDown>
        </div>
      </div>
    </div>
  );
};

export default Header;
