import { css } from '@/../styled-system/css';

import HeadingOneIcon from '@/icons/heading-one-icon';
import HeadingTwoIcon from '@/icons/heading-two-icon';
import HeadingThreeIcon from '@/icons/heading-three-icon';
import BulletedListIcon from '@/icons/bulleted-list-icon';
import NumberedListIcon from '@/icons/numbered-list-icon';
import QuoteIcon from '@/icons/quote-icon';

const menu = css({
  position: 'fixed',
  width: '17rem',
  height: '15rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  background: 'white',
  border: '1px solid lightgray',
  borderRadius: '.3rem',
  boxShadow: 'dropDown',
  fontSize: 'md',
  padding: 'tiny',
  zIndex: 1000,
});

const menuTitle = css({
  fontSize: '.8rem',
  fontWeight: 'bold',
  color: 'gray',
});

const slashButton = css({
  width: '100%',
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: { base: 'none', _hover: '#F1F1F0' },
  borderRadius: '.3rem',
  px: 'tiny',
  gap: 'tiny',
  cursor: 'pointer',
});

const buttonName = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  alignItems: 'center',
  width: '100%',
});

const markdown = css({
  color: 'grey',
});

const SlashMenu = ({ position }: { position: { x: number; y: number } }) => {
  return (
    <div style={{ top: `calc(${position.y}px - 17rem)`, left: position.x }} className={menu}>
      <div className={menuTitle}>blocks</div>
      <div className={slashButton}>
        <div className={buttonName}>
          <HeadingOneIcon color="black" />
          Heading 1
        </div>{' '}
        <div className={markdown}>#</div>
      </div>
      <div className={slashButton}>
        <div className={buttonName}>
          <HeadingTwoIcon color="black" />
          Heading 2
        </div>
        <div className={markdown}>##</div>
      </div>
      <div className={slashButton}>
        <div className={buttonName}>
          <HeadingThreeIcon color="black" />
          Heading 3
        </div>{' '}
        <div className={markdown}>###</div>
      </div>
      <div className={slashButton}>
        <div className={buttonName}>
          <BulletedListIcon color="black" />
          Bullted List
        </div>{' '}
        <div className={markdown}>-</div>
      </div>
      <div className={slashButton}>
        <div className={buttonName}>
          <NumberedListIcon color="black" />
          Numbered List
        </div>{' '}
        <div className={markdown}>1.</div>
      </div>
      <div className={slashButton}>
        <div className={buttonName}>
          <QuoteIcon color="black" />
          Quote{' '}
        </div>{' '}
        <div className={markdown}>|</div>
      </div>
    </div>
  );
};

export default SlashMenu;
