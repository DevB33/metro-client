'use client';

import { css } from '@/../styled-system/css';

import IFileType from '@/types/file-type';
import PageCloseIcon from '@/icons/page-close-icon';

const fileBox = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '2rem',
  gap: 'tiny',
  fontWeight: 'regular',
  fontSize: 'md',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  px: 'small',

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

const File = ({ file }: { file: IFileType }) => {
  return (
    <div className={fileBox}>
      <div className={fileToggleButton}>
        <PageCloseIcon color="black" />
      </div>
      <div>{file.icon}</div>
      <div>{file.title}</div>
    </div>
  );
};

export default File;
