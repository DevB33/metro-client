'use client';

import { useEffect, useRef, useState } from 'react';
import { css } from '@/../styled-system/css';
import useSWR, { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';

import { editNoteCover, editNoteIcon, getNoteInfo, getNoteList } from '@/apis/client/note';
import SWR_KEYS from '@/constants/swr-keys';
import { TOAST_ERRORMESSAGE } from '@/constants/toast-message';
import useClickOutside from '@/hooks/useClickOutside';
import IconSelector from './icon-selector';
import Tag from './tag';
import Title from './title';
import HoverMenu from './hover-menu';
import NoteCover from './note-cover';
import CoverModal from './cover-modal/cover-modal';

const NoteHeader = () => {
  const [isHover, setIsHover] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);

  const params = useParams();
  const noteId = params.id as string;

  const { data } = useSWR(SWR_KEYS.noteMetadata(noteId));

  useEffect(() => {
    try {
      mutate(SWR_KEYS.noteMetadata(noteId), getNoteInfo(noteId));
    } catch (error) {
      toast.error(TOAST_ERRORMESSAGE.NoteFetch);
    }
  }, [noteId]);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleSelectIcon = async (selectedIcon: string | null) => {
    try {
      await editNoteIcon(noteId, selectedIcon);
      await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
      await mutate(SWR_KEYS.noteMetadata(noteId), getNoteInfo(noteId));
    } catch (error) {
      toast.error(TOAST_ERRORMESSAGE.IconSelect);
    }
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
    try {
      await editNoteCover(noteId, selectedColor);
      await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
      await mutate(SWR_KEYS.noteMetadata(noteId), getNoteInfo(noteId), false);
    } catch (error) {
      toast.error(TOAST_ERRORMESSAGE.CoverSelect);
    }
  };

  const deleteCover = async () => {
    try {
      await editNoteCover(noteId, null);
      await mutate(SWR_KEYS.NOTE_LIST, getNoteList, false);
      await mutate(SWR_KEYS.noteMetadata(noteId), getNoteInfo(noteId), false);
    } catch (error) {
      toast.error(TOAST_ERRORMESSAGE.CoverDelete);
    }
  };

  const iconSelectorRef = useClickOutside(handleSelectorClose);
  if (!data) return null;

  return (
    <>
      {data.cover && (
        <NoteCover cover={data.cover} handleCoverModalOpen={handleCoverModalOpen} deleteCover={deleteCover} />
      )}
      {isCoverModalOpen && (
        <CoverModal handleSelectCover={handleSelectCover} handleCoverModalClose={handleCoverModalClose} />
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
        <Tag noteId={noteId} />
      </div>
    </>
  );
};

const headerConatiner = css({
  width: '44.5rem',
  position: 'relative',
  zIndex: '20',
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

export default NoteHeader;
