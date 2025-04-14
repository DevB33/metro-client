import { css } from '@/../styled-system/css';

import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import DropDown from '@/components/dropdown/dropdown';
import TrashIcon from '@/icons/trash-icon';
import ArrowReapeatIcon from '@/icons/arrow-repeat-icon';
import { useState } from 'react';

interface IBlockButton {
  OpenBlockMenu: () => void;
  CloseBlockMenu: () => void;
}

const blockBtnContainer = css({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'row',
});

const blockBtn = css({
  width: '1.5em',
  height: '1.5rem',
  padding: '0.2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  pointerEvents: 'auto',

  _hover: {
    backgroundColor: '#F1F1F0',
  },
});

const BlockButton = ({ OpenBlockMenu, CloseBlockMenu }: IBlockButton) => {
  const [isblockButtonModalOpen, setIsblockButtonModalOpen] = useState(false);

  const handleClose = () => {
    setIsblockButtonModalOpen(false);
    CloseBlockMenu();
  };
  const handleOpen = () => {
    setIsblockButtonModalOpen(true);
    OpenBlockMenu();
  };

  return (
    <div className={blockBtnContainer}>
      <div className={blockBtn}>
        <PlusIcon />
      </div>
      <div className={blockBtn} onMouseUp={handleOpen}>
        <GripVerticalIcon />
      </div>
      <DropDown handleClose={handleClose}>
        <DropDown.Menu isOpen={isblockButtonModalOpen} top="0.2rem" left="-11.5rem">
          <DropDown.Item>
            <ArrowReapeatIcon width="16px" height="16px" />
            제목 수정하기
          </DropDown.Item>
          <DropDown.Item>
            <TrashIcon />
            삭제하기
          </DropDown.Item>
        </DropDown.Menu>
      </DropDown>
    </div>
  );
};

export default BlockButton;
