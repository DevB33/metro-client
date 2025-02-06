import { css } from '@/../styled-system/css';
import TagIcon from '@/icons/tag-icon';
import { useEffect, useRef, useState } from 'react';
import ITagType from '@/types/tag-type';
import LineColor from '@/constants/line-color';
import TagBox from './tag-box';

const tagContainer = css({
  minHeight: '2rem',
  height: 'auto',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'start',
  gap: 'small',
  userSelect: 'none',
});

const typeContainer = css({
  minHeight: '2.5rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  width: '10rem',
  height: 'auto',
  borderRadius: '0.2rem',
  px: 'tiny',
  gap: 'tiny',
  color: 'grey',
  cursor: 'pointer',

  _hover: {
    backgroundColor: 'lightGray',
  },
});
const tagBoxContainer = css({
  minHeight: '2.5rem',
  height: 'auto',
  width: '35rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
  cursor: 'pointer',
  padding: 'tiny',
  borderRadius: '0.2rem',
  color: 'grey',
  flexWrap: 'wrap',

  _hover: {
    backgroundColor: 'lightGray',
  },
});

const tagInput = css({
  outline: 'none',
  flex: '1',
});

const Tag = () => {
  const [tagList, setTagList] = useState<ITagType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const getRandomColor = (): keyof typeof LineColor => {
    const colorKeys = Object.keys(LineColor) as Array<keyof typeof LineColor>;
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    return colorKeys[randomIndex];
  };

  const handleEditing = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleOutterClick = (e: MouseEvent) => {
      if (tagRef.current && !tagRef.current.contains(e.target as Node)) {
        setIsEditing(false);
      }
    };
    window.addEventListener('mousedown', handleOutterClick);
    return () => window.removeEventListener('mousedown', handleOutterClick);
  }, [tagRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setTagList([...tagList, { name: inputValue.trim(), color: getRandomColor() }]);
      e.currentTarget.value = '';
      setIsEditing(false);
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTagList(tagList.filter(tag => tag.name !== tagToDelete));
  };

  return (
    <div className={tagContainer} ref={tagRef}>
      <div className={typeContainer}>
        <TagIcon />
        태그
      </div>
      <button type="button" className={tagBoxContainer} onClick={handleEditing}>
        {isEditing && (
          <>
            {tagList.map(tag => (
              <TagBox
                isEditing={isEditing}
                tagName={tag.name}
                color={tag.color}
                onDelete={handleTagDelete}
              />
            ))}
            <input className={tagInput} ref={inputRef} onKeyDown={handleKeyDown} />
          </>
        )}
        {!isEditing && tagList.length === 0 && <>비어있음</>}
        {!isEditing &&
          tagList.length > 0 &&
          tagList.map(tag => (
            <TagBox
              isEditing={isEditing}
              tagName={tag.name}
              color={tag.color}
              onDelete={handleTagDelete}
            />
          ))}
      </button>
    </div>
  );
};

export default Tag;
