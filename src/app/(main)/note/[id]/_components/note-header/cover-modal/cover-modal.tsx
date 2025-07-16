import { css } from '@/../styled-system/css';

import { useClickOutside } from '@/hooks/useClickOutside';
import CoverModalHeader from './cover-modal-header';
import CoverModalContent from './cover-modal-content';

interface ICoverModalProps {
  handleSelectCover: (color: string) => void;
  handleCoverModalClose: () => void;
}

const CoverModal = ({ handleSelectCover, handleCoverModalClose }: ICoverModalProps) => {
  const coverModalRef = useClickOutside(handleCoverModalClose);

  return (
    <div ref={coverModalRef} className={container}>
      <CoverModalHeader />
      <CoverModalContent handleSelectCover={handleSelectCover} handleCoverModalClose={handleCoverModalClose} />
    </div>
  );
};

const container = css({
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

export default CoverModal;
