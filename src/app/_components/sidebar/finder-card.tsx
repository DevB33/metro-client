import { css } from '@/../styled-system/css';

import PageOpenIcon from '@/icons/page-open-icon';
import PageCloseIcon from '@/icons/page-close-icon';

const finderCard = css({
  width: '16rem',
  height: '44rem',
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  padding: 'small',
  fontWeight: 'regular',
  fontSize: 'md',
  backgroundColor: 'background',
  borderRadius: '10px',
  boxShadow: 'sidebar',
});

const finderButton = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'tiny',
});

const FinderCard = () => {
  return (
    <div className={finderCard}>
      <div className={finderButton}>
        <PageOpenIcon color="black" />
        <div>👾</div>
        <div>file open</div>
      </div>
      <div className={finderButton}>
        <PageCloseIcon color="black" />
        <div>👾</div>
        <div>file close</div>
      </div>
    </div>
  );
};

export default FinderCard;
