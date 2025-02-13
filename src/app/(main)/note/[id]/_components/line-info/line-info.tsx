import { css } from '@/../styled-system/css';

const lineInfoContainer = css({
  height: '6rem',
  minHeight: '6rem',
  display: 'flex',
});

const LineInfo = () => {
  return <div className={lineInfoContainer} />;
};

export default LineInfo;
