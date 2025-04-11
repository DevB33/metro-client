import { css } from '@/../styled-system/css';

import axios from 'axios';
import { cookies } from 'next/headers';

import Header from './_components/header';
import Content from './_components/content';

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  pb: '13rem',
});

const SharedNote = async ({ params }: { params: Promise<{ id: string }> }) => {
  const cookie = await cookies();
  const accessToken = cookie?.get('accessToken')?.value;
  const { id } = await params;

  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/documents/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const noteData = response.data;

  return (
    <div className={container}>
      <Header noteData={noteData} />
      <Content />
    </div>
  );
};

export default SharedNote;
