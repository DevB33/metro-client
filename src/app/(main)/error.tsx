'use client';

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div style={{ padding: 16 }}>
      <h2>문서를 불러오는 중 문제가 발생했어요.</h2>
      <p style={{ whiteSpace: 'pre-wrap', color: '#666' }}>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        다시 시도
      </button>
    </div>
  );
};

export default Error;
