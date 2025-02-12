import { css } from '@/../styled-system/css';

interface IDropdownHeaderProps {
  handleTabIndex: (index: number) => void;
}

const dropDownHeaderContainer = css({
  px: 'small',
  py: 'tiny',
  borderBottom: '1px solid',
  borderColor: 'lightGray',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
});

const headerButtonContainer = css({
  display: 'flex',
  gap: 'tiny',
  fontSize: 'md',
  color: 'grey',
});

const buttons = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
});

const DropdownHeader = ({ handleTabIndex }: IDropdownHeaderProps) => {
  return (
    <div className={dropDownHeaderContainer}>
      <div className={headerButtonContainer}>
        <button type="button" className={buttons} onClick={() => handleTabIndex(0)}>
          갤러리
        </button>
      </div>
    </div>
  );
};

export default DropdownHeader;
