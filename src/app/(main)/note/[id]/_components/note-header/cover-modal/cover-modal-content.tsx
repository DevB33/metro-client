import { css } from '@/../styled-system/css';
import COLOR_CATEGORIES from '@/constants/cover-color';

interface ICoverModalContentProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const CoverModalContent = ({ handleSelectCover, handleCoverModalClose }: ICoverModalContentProps) => {
  const handleClick = (color: string) => {
    handleSelectCover(color);
    handleCoverModalClose();
  };

  return (
    <div className={container}>
      {COLOR_CATEGORIES.map(category => (
        <div key={category.title}>
          <div className={imageCategory}>{category.title}</div>
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

const container = css({
  display: 'flex',
  flexDirection: 'column',
  height: 'auto',
  overflowY: 'scroll',
  px: 'small',
  py: 'tiny',
  userSelect: 'none',
});

const imageCategory = css({
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

export default CoverModalContent;
