import { css } from '@/../styled-system/css';
import { forwardRef, useState } from 'react';
import DropdownHeader from './dropdown-header';
import DropdownContent from './dropdown-content';

interface ICoverDropdownProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const dropdownContainer = css({
  position: 'absolute',
  top: '9rem',
  right: '1rem',
  width: '35rem',
  height: '30rem',
  borderRadius: 'lg',
  backgroundColor: 'white',
  boxShadow: 'dropDown',
  zIndex: '10000',
  display: 'flex',
  flexDirection: 'column',
});

const CoverDropdown = forwardRef<HTMLDivElement, ICoverDropdownProps>((props, ref) => {
  const { handleSelectCover, handleCoverModalClose } = props;
  const [tab, setTab] = useState(0);

  const handleTabIndex = (index: number) => {
    setTab(index);
  };

  return (
    <div ref={ref} className={dropdownContainer} {...props}>
      <DropdownHeader handleTabIndex={handleTabIndex} />
      <DropdownContent
        handleSelectCover={handleSelectCover}
        handleCoverModalClose={handleCoverModalClose}
      />
    </div>
  );
});

export default CoverDropdown;
