import { css } from '@/../styled-system/css';
import LightModeIcon from '@/icons/light-mode-icon';
import PageOpenIcon from '@/icons/page-open-icon';

const container = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  px: 'base',
  gap: 'small',
});

const divider = css({
  backgroundColor: 'gray',
  height: '1px',
  borderRadius: '1rem',
});

const titleContainer = css({
  display: 'flex',
  flexDirection: 'column',
});

const title = css({
  fontSize: 'md',
  fontWeight: 'bold',
});

const contentContainer = css({
  display: 'flex',
  flexDirection: 'row',
  px: 'small',
  justifyContent: 'space-between',
});

const contentTitleContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'tiny',
});

const contentTitle = css({
  fontSize: '0.8rem',
});

const description = css({
  fontSize: '0.6rem',
  color: 'gray600',
});

const dropdownContainer = css({
  width: '8rem',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'end',
  gap: 'tiny',
});

const SettingPage = () => {
  return (
    <div className={container}>
      <div className={titleContainer}>
        <div className={title}>기기 설정</div>
        <div className={divider} />
      </div>
      <div className={contentContainer}>
        <div className={contentTitleContainer}>
          <div className={contentTitle}>테마</div>
          <div className={description}>작업 환경에 맞는 테마를 선택하세요.</div>
        </div>
        <div className={dropdownContainer}>
          <LightModeIcon />
          <div className={contentTitle}>라이트모드</div>
          <PageOpenIcon color="black" />
        </div>
      </div>
      <div className={contentContainer}>
        <div className={contentTitleContainer}>
          <div className={contentTitle}>언어</div>
          <div className={description}>사용할 언어를 선택하세요.</div>
        </div>
        <div className={dropdownContainer}>
          <div className={contentTitle}>한국어</div>
          <PageOpenIcon color="black" />
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
