import { css } from '@/../styled-system/css';

interface INoteCoverProps {
  handleCoverModalOpen: () => void;
  deleteCover: () => void;
  cover: string;
}

const coverContainer = css({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  left: '0',
  top: '0.5rem',
  // width: '100vw',
  width: 'full',
  // minWidth: '44.5rem',
  minWidth: '54.5rem',
  height: '17.5rem',
  zIndex: 1,
  pt: '1rem',
  pr: '1rem',
  // mr: '1.5rem',
});

const innerContainer = css({
  width: '44.5rem',
  height: 'full',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'end',
});

const buttonContainer = css({
  width: '7.5rem',
  height: '1.75rem',
  backgroundColor: 'white',
  borderRadius: 'sm',
  display: 'flex',
  flexDirection: 'row',
  color: 'gray',
  fontSize: 'xs',
  cursor: 'pointer',
  userSelect: 'none',
});

const firstButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3.75rem',
  borderRight: '1px solid',
  borderColor: 'lightGray',
});

const secondButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3.75rem',
});

const NoteCover = ({ handleCoverModalOpen, deleteCover, cover }: INoteCoverProps) => {
  const sidebarWidth = localStorage.getItem('sidebarWidth');
  const defaultSidebarWidth = 17;
  const sidebarPadding = 2;
  const coverWidth = sidebarWidth
    ? `calc(100vw - ${sidebarWidth}rem - ${sidebarPadding}rem)`
    : `calc(100vw - ${defaultSidebarWidth}rem - ${sidebarPadding}rem)`;

  return (
    <div className={coverContainer} style={{ backgroundColor: cover, width: '100%' }}>
      <div className={innerContainer}>
        <div className={buttonContainer}>
          <div className={firstButton} onClick={handleCoverModalOpen}>
            커버변경
          </div>
          <div className={secondButton} onClick={deleteCover}>
            커버제거
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCover;
