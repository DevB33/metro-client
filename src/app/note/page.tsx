import { css } from '../../../styled-system/css';
import Header from './_components/header';

const NoteContainer = css({
  width: '1440px',
  height: '1024px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const NoteContent = css({
  width: '44.5rem',
  height: '60rem',
  backgroundColor: 'red',
  overflowY: 'scroll',
});

const Note = () => {
  return (
    <div className={NoteContainer}>
      <Header />
      <div className={NoteContent} />
    </div>
  );
};

export default Note;
