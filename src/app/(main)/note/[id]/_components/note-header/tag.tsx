import { css } from '@/../styled-system/css';
import TagIcon from '@/icons/tag-icon';
import { useEffect, useRef, useState } from 'react';
import ITagType from '@/types/tag-type';
import LineColor from '@/constants/line-color';
import TagBox from './tag-box';

const tagContainer = css({
  height: '2rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'small',
  userSelect: 'none',
});

const typeContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'start',
  width: '10rem',
  height: '2rem',
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
  height: '2rem',
  width: '35rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  gap: 'tiny',
  cursor: 'pointer',
  px: 'tiny',
  borderRadius: '0.2rem',
  color: 'grey',

  _hover: {
    backgroundColor: 'lightGray',
  },
});

const tagInput = css({
  outline: 'none',
  width: 'auto',
});

const Tag = () => {
  const [tagList, setTagList] = useState<ITagType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className={tagContainer}>
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
