import { css } from '@/../styled-system/css';

import placeholder from '@/constants/placeholder';

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
  return <input className={titleFont} placeholder={placeholder.noteTitle} />;
};

export default Title;
