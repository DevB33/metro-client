import { css } from '@/../styled-system/css';

import PageItem from './page-item';
import pageList from './page-list-mock';

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
      {pageList.map(page => {
        return <PageItem key={page.pageId} page={page} depth={1} />;
      })}
    </div>
  );
};

export default FinderCard;
