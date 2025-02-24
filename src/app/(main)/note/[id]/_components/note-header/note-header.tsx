'use client';

import { useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import useClickOutside from '@/hooks/useClickOutside';
import IconSelector from './icon-selector';
import Tag from './tag';
import Title from './title';
import HoverMenu from './hover-menu';
import NoteCover from './note-cover';
import CoverDropdown from './cover-dropdown/dropdown';

const headerConatiner = css({
  width: '44.5rem',
  position: 'relative',
  zIndex: 2,
});

const IconContainer = css({
  position: 'absolute',
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
  height: '6rem',
  width: '100%',
});

const noIcon = css({
  height: '3rem',
});

const NoteHeader = () => {
  const [isHover, setIsHover] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [icon, setIcon] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

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

  const handleSelectCover = (selectedColor: string) => {
    setCover(selectedColor);
  };

  const deleteCover = () => {
    setCover(null);
  };

  const iconSelectorRef = useClickOutside(handleSelectorClose);

  return (
    <>
      {cover && <NoteCover cover={cover} handleCoverModalOpen={handleCoverModalOpen} deleteCover={deleteCover} />}
      {isCoverModalOpen && (
        <CoverDropdown handleSelectCover={handleSelectCover} handleCoverModalClose={handleCoverModalClose} />
      )}

      <div
        className={headerConatiner}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ top: cover ? '-3rem' : '0rem' }}
      >
        {icon && (
          <>
            <button
              ref={iconRef}
              type="button"
              onClick={isSelectorOpen ? handleSelectorClose : handleSelectorOpen}
              className={IconContainer}
            >
              {icon}
            </button>
            <div className={IconMargin} />
          </>
        )}
        {!icon && <div className={noIcon} />}
        <div className={IconSelectorContainer} ref={iconSelectorRef}>
          <IconSelector
            handleSelectIcon={handleSelectIcon}
            handleSelectorClose={handleSelectorClose}
            isSelectorOpen={isSelectorOpen}
          />
        </div>
        <HoverMenu
          icon={icon}
          cover={cover}
          isHover={isHover}
          handleSelectorOpen={handleSelectorOpen}
          handleSelectIcon={handleSelectIcon}
          handleSelectCover={handleSelectCover}
        />
        <Title />
      </div>
      <Tag />
    </>
  );
};

export default NoteHeader;
