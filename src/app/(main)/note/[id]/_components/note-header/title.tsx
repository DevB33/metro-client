import { useState, useRef } from 'react';
import { css } from '@/../styled-system/css';

const titleFont = css({
  fontSize: 'lg',
  fontWeight: 'bold',
  width: '100%',
  wordBreak: 'break-all',
  resize: 'none',
  overflowY: 'auto',
  minHeight: '48px',
  maxHeight: '110px',
  lineHeight: '1.5',
  padding: '8px',
  border: 'none',
  outline: 'none',
  textOverflow: 'ellipsis',
  '&::placeholder': {
    color: 'lightgray',
  },
});

const Title = () => {
  const [value, setValue] = useState('');
  const isHovered = useRef(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 110)}px`;
    }
  };

  const handleMouseEnter = () => {
    isHovered.current = true;
    setIsScrollable(true);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.overflowY = 'auto';
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(
        () => {
          setIsScrollable(false);
        },
        (textarea?.scrollTop ?? 1) * 3,
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className={titleFont}
      placeholder="새 페이지"
      rows={1}
      value={value}
      onChange={handleChange}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      style={{
        display: '-webkit-box',
        WebkitLineClamp: isScrollable ? 'unset' : 2,
        WebkitBoxOrient: 'vertical',
      }}
    />
  );
};

export default Title;
