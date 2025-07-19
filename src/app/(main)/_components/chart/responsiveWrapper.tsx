'use client';

import React, { useRef, useState, useEffect } from 'react';
import { css } from '@/../styled-system/css';

import LineChart from './chart';

const ResponseWrapper = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [parentHeight, setParentHeight] = useState<number>(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setParentWidth(width);
        setParentHeight(height);
      }
    };

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    updateDimensions();

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={container} ref={containerRef}>
      {parentWidth > 0 && parentHeight > 0 && <LineChart width={parentWidth} height={parentHeight} />}
    </div>
  );
};

const container = css({
  width: '100%',
  height: '100%',
});

export default ResponseWrapper;
