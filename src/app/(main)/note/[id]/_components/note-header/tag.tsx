import { css } from '@/../styled-system/css';
import TagIcon from '@/icons/tag-icon';
import { useEffect, useRef, useState } from 'react';
import ITagType from '@/types/tag-type';
import LineColor from '@/constants/line-color';
import keyName from '@/constants/key-name';
import useClickOutside from '@/hooks/useClickOutside';
import useSWR, { mutate } from 'swr';
import { editNoteTags, getNoteInfo, getNoteList } from '@/apis/note';
import TagBox from './tag-box';

interface ITag {
  noteId: string;
}

const tagContainer = css({
  minHeight: '2rem',
  height: 'auto',
  width: '44.5rem',
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
  width: '100%',
  maxWidth: '35rem',
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
  color: 'black',
});

const Tag = ({ noteId }: ITag) => {
  const { data = { tags: [] } } = useSWR<{ tags: ITagType[] }>(`noteMetadata-${noteId}`);

  const tagList = data.tags;

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomColor = (): keyof typeof LineColor => {
    const colorKeys = Object.keys(LineColor) as Array<keyof typeof LineColor>;
    const randomIndex = Math.floor(Math.random() * colorKeys.length);
    return colorKeys[randomIndex];
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const endEditing = () => {
    setIsEditing(false);
  };

  const tagRef = useClickOutside(endEditing);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const isDuplicate = tagList.some(tag => tag.name === inputValue);

    if (e.key === keyName.enter) {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (isDuplicate || inputValue.trim() === '') {
        inputRef.current?.blur();
        e.currentTarget.value = '';
        setIsEditing(false);
        return;
      }

      await editNoteTags(noteId, [...tagList, { name: inputValue.trim(), color: getRandomColor() }]);
      await mutate('noteList', getNoteList, false);
      await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId), false);

      setIsEditing(false);
    }
  };

  const handleTagDelete = async (tagToDelete: string) => {
    await editNoteTags(
      noteId,
      tagList.filter(tag => tag.name !== tagToDelete),
    );
    await mutate('noteList', getNoteList, false);
    await mutate(`noteMetadata-${noteId}`, getNoteInfo(noteId), false);
  };

  return (
    <div className={tagContainer} ref={tagRef}>
      <div className={typeContainer}>
        <TagIcon />
        태그
      </div>
      <div
        role="button"
        tabIndex={0}
        className={tagBoxContainer}
        onClick={startEditing}
        onKeyDown={e => {
          if (e.key === keyName.enter) {
            startEditing();
          }
        }}
      >
        {tagList.map(tag => (
          <TagBox
            key={tag.name}
            isEditing={isEditing}
            tagName={tag.name}
            color={tag.color}
            onDelete={handleTagDelete}
          />
        ))}
        {isEditing && <input className={tagInput} ref={inputRef} onKeyDown={handleKeyDown} />}
        {!isEditing && tagList.length === 0 && <>비어있음</>}
      </div>
    </div>
  );
};

export default Tag;
