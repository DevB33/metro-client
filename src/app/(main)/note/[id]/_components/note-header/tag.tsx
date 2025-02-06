import { css, cva } from '@/../styled-system/css';

const tagContainer = css({
  height: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
});

const tagBox = cva({
  base: {
    height: '1rem',
    width: '4rem',
    color: 'white',
    fontSize: 'sm',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.25rem',
  },
  variants: {
    color: {
      lineOne: { backgroundColor: 'lineOne' },
      lineTwo: { backgroundColor: 'lineTwo' },
      lineThree: { backgroundColor: 'lineThree' },
    },
  },
});

const Tag = () => {
  return (
    <div className={tagContainer}>
      <div className={tagBox({ color: 'lineOne' })}>tag01</div>
      <div className={tagBox({ color: 'lineTwo' })}>tag02</div>
      <div className={tagBox({ color: 'lineThree' })}>tag03</div>
    </div>
  );
};

export default Tag;
