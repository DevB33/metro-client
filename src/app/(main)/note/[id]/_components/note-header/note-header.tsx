'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import IconSelector from './icon-selector';
import Tag from './tag';
import Title from './title';
import HoverMenu from './hover-menu';

const IconContainer = css({
  width: '5.5rem',
  height: '5.5rem',
  fontSize: 'xl',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: '0.5rem',
  mb: 'tiny',

  _hover: {
    backgroundColor: 'lightGray',
  },
});

const IconSelectorContainer = css({
  position: 'absolute',
  zIndex: '9999',
});
const NoteHeader = () => {
  const [isHover, setIsHover] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [icon, setIcon] = useState<string | null>(null);
  const iconSelectorRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleSelectIcon = (selectedIcon: string | null) => {
    setIcon(selectedIcon);
  };

  const handleSelectorOpen = () => {
    setIsSelectorOpen(true);
  };

  const handleSelectorClose = () => {
    setIsSelectorOpen(false);
  };

  useEffect(() => {
    const handleOutterClick = (e: MouseEvent) => {
      if (iconSelectorRef.current && !iconSelectorRef.current.contains(e.target as Node)) {
        handleSelectorClose();
      }
    };
    window.addEventListener('mousedown', handleOutterClick);
    return () => window.removeEventListener('mousedown', handleOutterClick);
  }, [iconSelectorRef]);

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {icon && (
          <button
            type="button"
            onClick={isSelectorOpen ? handleSelectorClose : handleSelectorOpen}
            className={IconContainer}
          >
            {icon}
          </button>
        )}
        <div className={IconSelectorContainer} ref={iconSelectorRef}>
          <IconSelector
            handleSelectIcon={handleSelectIcon}
            handleSelectorClose={handleSelectorClose}
            isSelectorOpen={isSelectorOpen}
          />
        </div>
        <HoverMenu
          icon={icon}
          isHover={isHover}
          handleSelectorOpen={handleSelectorOpen}
          handleSelectIcon={handleSelectIcon}
        />
        <Title />
      </div>
      <Tag />
    </>
  );
};

export default NoteHeader;
