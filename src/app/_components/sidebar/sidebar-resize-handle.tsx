'use client';

import { css } from '@/../styled-system/css';

const dragHandle = css({
  width: '.2rem',
  margin: '1.5rem 0',
  cursor: 'col-resize',
  borderRadius: '10px',
  backgroundColor: 'black',
  opacity: { base: 0, _hover: 0.1 },
  transition: '0.3s',
});

const SideBarResizeHandle = ({
  sideBarRef,
  setSidebarWidth,
}: {
  sideBarRef: React.RefObject<HTMLDivElement>;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const minWidth = 17;
  const maxWidth = 50;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = sideBarRef.current
      ? parseFloat(getComputedStyle(sideBarRef.current).width) / 16
      : 20;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(minWidth, startWidth + (moveEvent.clientX - startX) / 16),
        maxWidth,
      );
      const sidebarElement = sideBarRef.current;
      if (sidebarElement) {
        sidebarElement.style.width = `${newWidth}rem`;
      }
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', newWidth.toString());
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return <div className={dragHandle} onMouseDown={handleMouseDown} />;
};

export default SideBarResizeHandle;
