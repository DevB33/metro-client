import { ReactNode } from 'react';
import { css } from '@/../styled-system/css';

interface IDropDownItemProps {
  children: ReactNode;
  onClick?: () => void;
}

const dropdownItemContainer = css({
  display: 'flex',
  flexDirection: 'row',
  gap: 'tiny',
  alignItems: 'center',
  justifyContent: 'start',
  height: '2rem',
  fontSize: '0.8rem',
  userSelect: 'none',
});

const hoverContainer = css({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '2rem',
  gap: 'tiny',
  alignItems: 'center',
  justifyContent: 'start',
  px: '0.4rem',
  py: '0.4rem',
  borderRadius: '0.3rem',

  _hover: {
    backgroundColor: 'lightGray',
  },
});

const DropDownItem = ({ children, onClick }: IDropDownItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    console.log('123');
    e.stopPropagation(); // 이벤트 버블링 중지 제거
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={dropdownItemContainer} onClick={handleClick}>
      <div className={hoverContainer}>{children}</div>
    </div>
  );
};

export default DropDownItem;
