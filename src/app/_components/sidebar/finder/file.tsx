'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@/../styled-system/css';

import IFileType from '@/types/file-type';
import PageCloseIcon from '@/icons/page-close-icon';
import PageOpenIcon from '@/icons/page-open-icon';
import FileIcon from '@/icons/file-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import PlusIcon from '@/icons/plus-icon';

const fileContainer = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const fileItem = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: '2rem',
  pr: 'tiny',
  gap: '0.25rem',
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '0.25rem',
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: '#F1F1F0',
  },
});

const fileButton = css({
  borderRadius: '0.25rem',

  '&:hover': {
    backgroundColor: '#E4E4E3',
  },
});

const fileButtonContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
});

const fileIcon = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '1.5rem',
  height: '1.5rem',
  minWidth: '1.5rem',
  minHeight: '1.5rem',
});

const fileTitle = css({
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const fileCildren = css({
  display: 'flex',
  flexDirection: 'column',
});

const noChildren = css({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '2rem',
  pl: 'large',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const File = ({ file, depth }: { file: IFileType; depth: number }) => {
  const router = useRouter();
  const toggleButtoonRef = useRef<HTMLButtonElement>(null);
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const togglePage = () => {
    setIsOpen(!isOpen);
  };

  const openPage = (
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (toggleButtoonRef.current?.contains(event.target as Node)) return;
    if (settingButtonRef.current?.contains(event.target as Node)) return;
    if (plusButtonRef.current?.contains(event.target as Node)) return;

    router.push(`/note/${file.docsId}`);
  };

  const openSettingDropdown = () => {
    // TODD: 페이지 설정 드롭다운 열기
  };

  const deletePage = () => {
    // TODD: 페이지 삭제
  };

  return (
    <div className={fileContainer}>
      <div
        className={fileItem}
        style={{ paddingLeft: `${depth * 0.5}rem` }}
        onClick={openPage}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onKeyDown={openPage}
        role="button"
        tabIndex={0}
      >
        <button type="button" ref={toggleButtoonRef} className={fileButton} onClick={togglePage}>
          {isOpen ? <PageOpenIcon color="black" /> : <PageCloseIcon color="black" />}
        </button>
        <div className={fileIcon}>{file.icon ? `${file.icon}` : <FileIcon />}</div>
        <div className={fileTitle}>{file.title}</div>
        {isHover && (
          <div className={fileButtonContainer}>
            <button
              type="button"
              ref={settingButtonRef}
              className={fileButton}
              onClick={openSettingDropdown}
            >
              <HorizonDotIcon />
            </button>
            <button type="button" ref={plusButtonRef} className={fileButton} onClick={deletePage}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
      {isOpen &&
        (file.children.length ? (
          <div className={fileCildren}>
            {file.children.map(child => (
              <File key={child.docsId} file={child} depth={depth + 1} />
            ))}
          </div>
        ) : (
          <div className={noChildren}>하위 페이지 없음</div>
        ))}
    </div>
  );
};

export default File;
