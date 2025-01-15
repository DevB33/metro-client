import { css } from '@/../styled-system/css';

const styles = css({
  fontFamily: 'var(--font-noto-sans)',
  fontSize: 'xxl',
  fontWeight: 'black',
  display: 'flex',
  gap: 'xxl',
});

const Home = () => {
  return (
    <div className={styles}>
      <div>Metro</div>
      <div>mmmm</div>
    </div>
  );
};

export default Home;
