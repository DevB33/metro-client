'use client';

import { useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import useSWR, { mutate } from 'swr';
import { deletePage, getPageList } from '@/apis/side-bar';

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

const shareButton = css({
  cursor: 'pointer',
});

const dropDownButton = css({
  cursor: 'pointer',
});

const Header = () => {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const pageId = pathname.split('note/')[1];
  console.log(pageId);

  const { data: pageList } = useSWR('pageList');

  const openSettingDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeSettingDropdown = () => {
    setIsDropdownOpen(false);
  };

  const sharePage = () => {
    router.push(`/note/share/${noteId}`);
  };

  const handleDeleteButtonClick = async () => {
    try {
      await deletePage(pageId);
      await mutate('pageList', getPageList, false);
    } catch (error) {
      console.log(error);
    }
    closeSettingDropdown();
  };

  return (
    <div className={headerConatiner}>
      <div className={leftItemsConatiner}>
        <LeftArrowIcon />
        <RightArrowIcon />
      </div>
      <div className={rightItemsConatiner}>
        <button type="button" className={shareButton} onClick={sharePage}>
          공유
        </button>
        <button type="button" className={dropDownButton} onClick={openSettingDropdown}>
          <HorizonDotIcon />
          <DropDown handleClose={closeSettingDropdown}>
            <DropDown.Menu isOpen={isDropdownOpen} top="0.5rem" right="0">
              <DropDown.Item onClick={handleDeleteButtonClick}>
                <TrashIcon />
                삭제하기
              </DropDown.Item>
            </DropDown.Menu>
          </DropDown>
        </button>
      </div>
    </div>
  );
};

export default Header;
