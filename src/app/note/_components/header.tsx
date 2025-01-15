import LeftArrowIcon from '@/icons/left-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import HorizonDotIcon from '@/icons/horizon-dot-icon';
import { css } from '../../../../styled-system/css';

const HeaderConatiner = css({
  width: 'full',
  paddingTop: 'small',
  pl: 'small',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const LeftItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const RightItemsConatiner = css({
  display: 'flex',
  gap: 'small',
});

const Header = () => {
  return (
    <div className={HeaderConatiner}>
      <div className={LeftItemsConatiner}>
        <LeftArrowIcon />
        <RightArrowIcon />
      </div>
      <div className={RightItemsConatiner}>
        <div>공유</div>
        <HorizonDotIcon />
      </div>
    </div>
  );
};

export default Header;
