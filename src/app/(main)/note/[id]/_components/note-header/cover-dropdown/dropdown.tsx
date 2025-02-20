import { css } from '@/../styled-system/css';
import useClickOutside from '@/app/hooks/useClickOutside';
import DropdownHeader from './dropdown-header';
import DropdownContent from './dropdown-content';

interface ICoverDropdownProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const dropdownContainer = css({
  position: 'absolute',
  top: '5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '35rem',
  height: '30rem',
  borderRadius: 'lg',
  backgroundColor: 'white',
  boxShadow: 'dropDown',
  zIndex: '10000',
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
});

const CoverDropdown = ({ handleSelectCover, handleCoverModalClose }: ICoverDropdownProps) => {
  const coverModalRef = useClickOutside(handleCoverModalClose);

  return (
    <div ref={coverModalRef} className={dropdownContainer}>
      <DropdownHeader />
      <DropdownContent
        handleSelectCover={handleSelectCover}
        handleCoverModalClose={handleCoverModalClose}
      />
    </div>
  );
};

export default CoverDropdown;
