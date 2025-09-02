import { css } from '@/../styled-system/css';
import { SWRConfig } from 'swr';

import SWR_KEYS from '@/constants/swr-keys';
import { getNoteInfo } from '@/apis/server/note';
import getBlockList from '@/apis/server/block';
import Header from './_components/header';
import ContentContainer from './_components/contentContainer';

const Note = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  let noteMetadata;
  try {
    noteMetadata = await getNoteInfo(id);
  } catch (error) {
    throw new Error('노트 정보를 불러오기 실패');
  }

  let blockList;
  try {
    blockList = await getBlockList(id);
  } catch (error) {
    throw new Error('블록 목록 불러오기 실패');
  }

  return (
    <SWRConfig
      value={{
        fallback: {
          [SWR_KEYS.noteMetadata(id)]: noteMetadata,
          [SWR_KEYS.blockList(id)]: blockList.blocks,
        },
      }}
    >
      <div className={container}>
        <Header />
        <ContentContainer />
      </div>
    </SWRConfig>
  );
};

const container = css({
  position: 'relative',
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyItems: 'start',
  overflowX: 'scroll',
});

export default Note;
