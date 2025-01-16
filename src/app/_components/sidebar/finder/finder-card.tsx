import { css } from '@/../styled-system/css';

import File from './file';
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

const FinderCard = () => {
  return (
    <div className={finderCard}>
      {fileList.map(file => {
        return <File key={file.docsId} file={file} />;
      })}
    </div>
  );
};

export default FinderCard;
