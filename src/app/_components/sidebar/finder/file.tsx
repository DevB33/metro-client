'use client';

import { useState } from 'react';
import { css } from '@/../styled-system/css';

import IFileType from '@/types/file-type';
import PageCloseIcon from '@/icons/page-close-icon';
import PageOpenIcon from '@/icons/page-open-icon';

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
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  pl: 'calc(100% + 0.5rem)',

  '&:hover': {
    backgroundColor: '#F1F1F0',
  },
});

const fileToggleButton = css({
  borderRadius: '0.25rem',

  '&:hover': {
    backgroundColor: '#E4E4E3',
  },
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
  const [isOpen, setIsOpen] = useState(false);

  const togglePage = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={fileContainer}>
      <div className={fileItem} style={{ paddingLeft: `${depth * 0.5}rem` }}>
        <div
          className={fileToggleButton}
          onClick={togglePage}
          onKeyDown={togglePage}
          role="button"
          tabIndex={0}
        >
          {isOpen ? <PageOpenIcon color="black" /> : <PageCloseIcon color="black" />}
        </div>
        <div>{file.icon}</div>
        <div className={fileTitle}>{file.title}</div>
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
