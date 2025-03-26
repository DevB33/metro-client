import { css } from '@/../styled-system/css';

import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';

const blockBtnContainer = css({
  position: 'absolute',
  left: '2rem',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'row',
  pointerEvents: 'none',
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

const BlockButton = () => {
  return (
    <div className={blockBtnContainer}>
      <div className={blockBtn}>
        <PlusIcon />
      </div>
      <div className={blockBtn}>
        <GripVerticalIcon />
      </div>
    </div>
  );
};

export default BlockButton;
