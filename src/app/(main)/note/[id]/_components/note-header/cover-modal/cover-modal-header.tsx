import { css } from '@/../styled-system/css';

const CoverModalHeader = () => {
  return <div className={container}>갤러리</div>;
};

const container = css({
  px: 'small',
  py: 'tiny',
  borderBottom: '1px solid',
  borderColor: 'lightGray',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  color: 'grey',
});

export default CoverModalHeader;
