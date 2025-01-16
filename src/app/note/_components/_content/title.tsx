import { css } from '../../../../../styled-system/css';

const titleFont = css({
  fontSize: 'lg',
  fontWeight: 'bold',
});

const Title = () => {
  return <div className={titleFont}>Page01</div>;
};

export default Title;
