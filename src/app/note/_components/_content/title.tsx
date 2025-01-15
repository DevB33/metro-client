import { css } from '../../../../../styled-system/css';

const TitleFont = css({
  fontSize: 'lg',
  fontWeight: 'bold',
});

const Title = () => {
  return <div className={TitleFont}>Page01</div>;
};

export default Title;
