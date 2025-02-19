import { css } from '@/../styled-system/css';

const dropDownHeaderContainer = css({
  px: 'small',
  py: 'tiny',
  borderBottom: '1px solid',
  borderColor: 'lightGray',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'start',
  color: 'grey',
});

const DropdownHeader = () => {
  return <div className={dropDownHeaderContainer}>갤러리</div>;
};

export default DropdownHeader;
