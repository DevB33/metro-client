import { css } from '@/../styled-system/css';

import PlusIcon from '@/icons/plus-icon';
import GripVerticalIcon from '@/icons/grip-vertical-icon';
import { useRef } from 'react';
import GhostBlock from './block/ghost-block';

const blockBtnContainer = css({
  position: 'absolute',
  left: '15rem',
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

const BlockButton = ({ index, block, blockList }: any) => {
  const ghostRef = useRef<HTMLDivElement>(null);

  const handleDragStart = async (event: React.DragEvent<HTMLDivElement>) => {
    if (ghostRef.current) {
      const ghost = ghostRef.current;
      event.dataTransfer.setDragImage(ghost, 10, 10);
    }
  };

  return (
    <div className={blockBtnContainer}>
      <GhostBlock ghostRef={ghostRef} block={block} blockList={blockList} index={index} />
      <div className={blockBtn}>
        <PlusIcon />
      </div>
      <div className={blockBtn} draggable onDragStart={handleDragStart}>
        <GripVerticalIcon />
      </div>
    </div>
  );
};

export default BlockButton;
