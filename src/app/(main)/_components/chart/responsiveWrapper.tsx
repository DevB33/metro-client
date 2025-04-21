'use client';

import React, { useRef, useState, useEffect } from 'react';
import { css } from '@/../styled-system/css';
import LineChart from './chart';

const wrapperContainer = css({
  width: '100%',
  height: '100%',
});

// 부모의 너비의 80%와 높이의 80%를 계산하여 전달하는 컴포넌트
const ResponseWrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setParentWidth(width); // 80%로 계산
        setParentHeight(height); // 80%로 계산
      }
    };

    // 부모의 크기 변화 감지
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    // 초기 크기 업데이트
    updateDimensions();

    // cleanup
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={wrapperContainer} ref={containerRef}>
      {parentWidth > 0 && parentHeight > 0 && <LineChart width={parentWidth} height={parentHeight} />}
    </div>
  );
};

export default ResponseWrapper;
