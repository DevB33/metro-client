import { css } from '@/../styled-system/css';

import PageCloseIcon from '@/icons/page-close-icon';
import fileList from './file-list-mock';

const finderCard = css({
  width: '16rem',
  height: '44rem',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: 'small',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const fileStyle = css({
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

const FinderCard = () => {
  return (
    <div className={finderCard}>
      {fileList.map(file => {
        return (
          <div className={fileStyle}>
            <div className={fileToggleButton}>
              <PageCloseIcon color="black" />
            </div>
            <div>{file.icon}</div>
            <div>{file.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default FinderCard;
