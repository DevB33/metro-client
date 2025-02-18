import { css } from '@/../styled-system/css';

import LeftArrowIcon from '@/icons/left-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';

const headerConatiner = css({
  boxSizing: 'border-box',
  width: '100%',
  paddingTop: 'small',
  px: 'small',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const leftItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const rightItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const Header = () => {
  return (
    <div className={headerConatiner}>
      <div className={leftItemsConatiner}>
        <LeftArrowIcon />
        <RightArrowIcon />
      </div>
      <div className={rightItemsConatiner}>
        <div>공유</div>
        <HorizonDotIcon />
      </div>
    </div>
  );
};

export default Header;
