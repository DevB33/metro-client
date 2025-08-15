import { ReactNode } from 'react';
import { css } from '@/../styled-system/css';

const DropDownItem = ({ children, onClick }: IDropDownItemProps) => {
  return (
    <button className={container} onClick={onClick} type="button">
      <div className={hoverContainer}>{children}</div>
    </button>
  );
};

interface IDropDownItemProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const container = css({
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

export default DropDownItem;
