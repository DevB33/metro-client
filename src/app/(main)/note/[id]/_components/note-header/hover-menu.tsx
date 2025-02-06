import { css } from '@/../styled-system/css';
import ImageIcon from '@/icons/image-icon';
import SmileIcon from '@/icons/smile-icon';

interface IHoverMenuProps {
  isHover: boolean;
  icon: string | null;
  handleSelectorOpen: () => void;
  handleSelectIcon: (icon: string | null) => void;
}

const hoverMenuContainer = css({
  display: 'flex',
  flexDirection: 'row',
  height: '2.5rem',
  gap: 'tiny',
  alignItems: 'center',
  userSelect: 'none',
});

const hoverMenu = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: '2rem',
  color: 'gray',
  gap: 'tiny',
  borderRadius: '0.5rem',
  padding: 'tiny',
  fontSize: 'md',
  fontWeight: 'light',
  cursor: 'pointer',
  userSelect: 'none',

  _hover: {
    backgroundColor: '#F2F2F2',
  },
});

const HoverMenu = ({ isHover, icon, handleSelectorOpen, handleSelectIcon }: IHoverMenuProps) => {
  return (
    <div className={hoverMenuContainer}>
      {isHover && (
        <>
          {!icon ? (
            <button type="button" className={hoverMenu} onClick={handleSelectorOpen}>
              <SmileIcon />
              아이콘 추가
            </button>
          ) : (
            <button type="button" className={hoverMenu} onClick={() => handleSelectIcon(null)}>
              <SmileIcon />
              아이콘 제거
            </button>
          )}
          <button type="button" className={hoverMenu}>
            <ImageIcon />
            커버 추가
          </button>
        </>
      )}
    </div>
  );
};

export default HoverMenu;
