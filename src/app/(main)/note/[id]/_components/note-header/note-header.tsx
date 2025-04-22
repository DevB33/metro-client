'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import { useClickOutside } from '@/hooks/useClickOutside';
import useSWR, { mutate } from 'swr';
import { useParams } from 'next/navigation';
import { editCover, editIcon, getNoteInfo } from '@/apis/note-header';
import { getPageList } from '@/apis/side-bar';
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
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  const params = useParams();
  const noteId = params.id as string;

  const { data } = useSWR(`noteMetadata-${noteId}`);

  useEffect(() => {
    mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId));
  }, []);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleSelectIcon = async (selectedIcon: string | null) => {
    await editIcon(noteId, selectedIcon);
    await mutate('pageList', getPageList, false);
    await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId));
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

  const handleSelectCover = async (selectedColor: string) => {
    await editCover(noteId, selectedColor);
    await mutate('pageList', getPageList, false);
    await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId), false);
  };

  const deleteCover = async () => {
    await editCover(noteId, null);
    await mutate('pageList', getPageList, false);
    await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId), false);
  };

  const iconSelectorRef = useClickOutside(handleSelectorClose);
  if (!data) return null;

  return (
    <>
      {data.cover && (
        <NoteCover cover={data.cover} handleCoverModalOpen={handleCoverModalOpen} deleteCover={deleteCover} />
      )}
      {isCoverModalOpen && (
        <CoverDropdown handleSelectCover={handleSelectCover} handleCoverModalClose={handleCoverModalClose} />
      )}

      <div
        className={headerConatiner}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ top: data.cover ? '-3rem' : '0rem' }}
      >
        {data.icon && (
          <>
            <button
              ref={iconRef}
              type="button"
              onClick={isSelectorOpen ? handleSelectorClose : handleSelectorOpen}
              className={IconContainer}
            >
              {data.icon}
            </button>
            <div className={IconMargin} />
          </>
        )}
        {!data.icon && <div className={noIcon} />}
        <div className={IconSelectorContainer} ref={iconSelectorRef}>
          <IconSelector
            handleSelectIcon={handleSelectIcon}
            handleSelectorClose={handleSelectorClose}
            isSelectorOpen={isSelectorOpen}
          />
        </div>
        <HoverMenu
          icon={data.icon}
          cover={data.cover}
          isHover={isHover}
          handleSelectorOpen={handleSelectorOpen}
          handleSelectIcon={handleSelectIcon}
          handleSelectCover={handleSelectCover}
        />
        <Title noteId={noteId} />
      </div>
      <Tag noteId={noteId} />
    </>
  );
};

export default NoteHeader;
