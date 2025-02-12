'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import IconSelector from './icon-selector';
import Tag from './tag';
import Title from './title';
import HoverMenu from './hover-menu';
import NoteCover from './note-cover';
import CoverDropdown from './cover-dropdown/dropdown';

const headerConatiner = css({
  width: '44.5rem',
  position: 'relative', // 기준 요소
  zIndex: 2, // coverContainer보다 위에 있도록 조정
});

const IconContainer = css({
  position: 'absolute',
  top: '-3rem',
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

const IconMargin = css({
  height: '3rem',
  width: '100%',
});

const NoteHeader = () => {
  const [isHover, setIsHover] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [icon, setIcon] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>('asdf');
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const iconSelectorRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const coverModalRef = useRef<HTMLDivElement | null>(null);

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

  const handleCoverModalOpen = () => {
    setIsCoverModalOpen(true);
  };

  const handleCoverModalClose = () => {
    setIsCoverModalOpen(false);
  };

  useEffect(() => {
    const handleOutterClick = (e: MouseEvent) => {
      if (
        iconRef.current &&
        iconSelectorRef.current &&
        !iconRef.current.contains(e.target as Node) &&
        !iconSelectorRef.current.contains(e.target as Node)
      ) {
        handleSelectorClose();
      }
    };
    window.addEventListener('mousedown', handleOutterClick);
    return () => window.removeEventListener('mousedown', handleOutterClick);
  }, [iconSelectorRef]);

  useEffect(() => {
    const handleOutterClick = (e: MouseEvent) => {
      if (coverModalRef.current && !coverModalRef.current.contains(e.target as Node)) {
        handleCoverModalClose();
      }
    };
    window.addEventListener('mousedown', handleOutterClick);
    return () => window.removeEventListener('mousedown', handleOutterClick);
  }, [coverModalRef]);

  return (
    <>
      {cover && <NoteCover handleCoverModalOpen={handleCoverModalOpen} />}
      {isCoverModalOpen && <CoverDropdown ref={coverModalRef} />}
      <div
        className={headerConatiner}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {icon && (
          <>
            <div className={IconMargin} />
            <button
              ref={iconRef}
              type="button"
              onClick={isSelectorOpen ? handleSelectorClose : handleSelectorOpen}
              className={IconContainer}
            >
              {icon}
            </button>
          </>
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
