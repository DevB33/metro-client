import { css } from '@/../styled-system/css';

interface INoteCoverProps {
  handleCoverModalOpen: () => void;
}

const coverContainer = css({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  left: '0',
  top: '3rem',
  width: '100%',
  height: '17.5rem',
  backgroundColor: 'gray',
  zIndex: 1,
  pt: '1rem',
  pr: '1rem',
});

const innerContainer = css({
  width: '44.5rem',
  height: 'full',
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'end',
});

const buttonContainer = css({
  width: '11.25rem',
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
  borderRight: '1px solid',
  borderColor: 'lightGray',
  width: '3.75rem',
});
const thirdButton = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '3.75rem',
});

const NoteCover = ({ handleCoverModalOpen }: INoteCoverProps) => {
  return (
    <div className={coverContainer}>
      <div className={innerContainer}>
        <div className={buttonContainer}>
          <div className={firstButton} onClick={handleCoverModalOpen}>
            커버변경
          </div>
          <div className={secondButton}>커버제거</div>
          <div className={thirdButton}>위치변경</div>
        </div>
      </div>
    </div>
  );
};

export default NoteCover;
