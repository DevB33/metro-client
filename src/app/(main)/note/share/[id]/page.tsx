import { css } from '@/../styled-system/css';

import { getNoteInfo } from '@/apis/server/note';
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
  const { id } = await params;

  const noteData = await getNoteInfo(id);

  return (
    <div className={container}>
      <Header noteData={noteData} />
      <Content />
    </div>
  );
};

export default SharedNote;
