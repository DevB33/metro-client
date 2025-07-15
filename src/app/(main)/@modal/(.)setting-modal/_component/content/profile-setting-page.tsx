import { useState } from 'react';
import { redirect } from 'next/navigation';
import useSWR from 'swr';
import { css, cva } from '@/../styled-system/css';
import Image from 'next/image';

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

const profileContainer = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  gap: 'base',
});

const profileImageContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'tiny',
});

const profileImage = css({
  width: '6rem',
  height: '6rem',
  borderRadius: '50%',
  backgroundColor: 'gray',
});

const profileSettingContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'tiny',
});

const profileSettingInput = css({
  width: '12rem',
  height: '2rem',
  backgroundColor: '#F1F1F1',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'gray',
  borderRadius: '0.5rem',
  px: 'tiny',
});

const imageText = css({
  display: 'flex',
  justifyContent: 'center',
  fontSize: '0.75rem',
});

const stateContainer = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'tiny',
});

const colorBox = cva({
  base: {
    width: '3rem',
    height: '1.2rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '10%',
    fontSize: '0.6rem',
    fontWeight: 'bold',
    backgroundColor: '#FFF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  variants: {
    color: {
      warning: { borderColor: 'warning', color: 'warning' },
      error: { borderColor: 'error', color: 'error' },
    },
  },
});

const description = css({
  fontSize: '0.6rem',
  color: 'gray600',
});

const ProfileSettingPage = () => {
  const { data: userInfo } = useSWR(`userInfo`);
  const [name, setName] = useState(userInfo?.name || '');

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    } finally {
      redirect('/login');
    }
  };

  return (
    <div className={container}>
      <div className={titleContainer}>
        <div className={title}>프로필</div>
        <div className={divider} />
      </div>
      <div className={profileContainer}>
        <div className={profileImageContainer}>
          <Image src={userInfo?.avatar} alt="Profile Image" className={profileImage} width={96} height={96} />
          <div className={imageText}>사진 추가</div>
        </div>
        <div className={profileSettingContainer}>
          <div className={title}>이름 설정</div>
          <input
            placeholder={userInfo?.name}
            value={name}
            onChange={event => setName(event.target.value)}
            className={profileSettingInput}
          />
        </div>
      </div>
      <div className={titleContainer}>
        <div className={title}>회원 상태 관리</div>
        <div className={divider} />
      </div>
      <div className={stateContainer}>
        <button type="button" className={colorBox({ color: 'warning' })} onClick={handleLogout}>
          로그아웃
        </button>
        <div className={description}>현재 작업중이던 문서의 저장 여부를 확인하세요</div>
      </div>
      <div className={stateContainer}>
        <div className={colorBox({ color: 'error' })}>회원 탈퇴</div>
        <div className={description}>탈퇴를 하게 되면 모든 기록이 사라집니다.</div>
      </div>
    </div>
  );
};

export default ProfileSettingPage;
