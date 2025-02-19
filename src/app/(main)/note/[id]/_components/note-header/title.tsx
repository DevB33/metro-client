import { css } from '@/../styled-system/css';

const titleFont = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  _placeholder: {
    color: 'lightgray',
  },
  _focus: {
    outline: 'none',
  },
  width: '100%',
});

const Title = () => {
  return <input className={titleFont} placeholder="새 페이지" />;
};

export default Title;
