import { css } from '@/../styled-system/css';
import colorCategories from '@/constants/cover-color';

interface ICoverDropdownContentProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const dropDownContentContainer = css({
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  overflowY: 'scroll',
  px: 'small',
  py: 'tiny',
  userSelect: 'none',
});

const imageDescription = css({
  height: '1.25rem',
  fontSize: '0.9rem',
  color: 'grey',
  my: '0.5rem',
});

const imageContainer = css({
  height: 'auto',
  flexWrap: 'wrap',
  display: 'flex',
  flexDirection: 'row',
  gap: 'tiny',
});

const image = css({
  width: '7.5rem',
  height: '4rem',
  backgroundColor: 'gray',
  borderRadius: 'sm',
  cursor: 'pointer',
});

const DropdownContent = ({
  handleSelectCover,
  handleCoverModalClose,
}: ICoverDropdownContentProps) => {
  const handleClick = (color: string) => {
    handleSelectCover(color);
    handleCoverModalClose();
  };

  return (
    <div className={dropDownContentContainer}>
      {colorCategories.map(category => (
        <div key={category.title}>
          <div className={imageDescription}>{category.title}</div>
          <div className={imageContainer}>
            {category.colors.map(color => (
              <button
                type="button"
                key={color}
                className={image}
                style={{ backgroundColor: color }}
                onClick={() => handleClick(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropdownContent;
