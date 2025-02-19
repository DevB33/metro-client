import { css } from '@/../styled-system/css';

const lineInfoContainer = css({
  width: '44.5rem',
  height: '6rem',
  display: 'flex',
});

const LineInfo = () => {
  return <div className={lineInfoContainer} />;
};

export default LineInfo;
