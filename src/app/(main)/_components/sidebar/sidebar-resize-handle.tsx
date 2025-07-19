'use client';

import { useState } from 'react';
import { css } from '@/../styled-system/css';

import SidebarOpenIcon from '@/icons/sidebar-open-icon';
import SidebarCloseIcon from '@/icons/sidebar-close-icon';

const SideBarResizeHandle = ({
  sideBarRef,
  isOpen,
  setIsOpen,
}: {
  sideBarRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const minWidth = 17;
  const maxWidth = 50;

  const [isHover, setIsHover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen) {
      const startX = e.clientX;
      const startWidth = sideBarRef.current ? parseFloat(getComputedStyle(sideBarRef.current).width) / 16 : 20;

      const onMouseMove = (moveEvent: MouseEvent) => {
        setMousePosition({ x: moveEvent.clientX, y: moveEvent.clientY });
        const newWidth = Math.min(Math.max(minWidth, startWidth + (moveEvent.clientX - startX) / 16), maxWidth);
        const sidebarElement = sideBarRef.current;
        if (sidebarElement) {
          sidebarElement.style.width = `${newWidth}rem`;
        }
        localStorage.setItem('sidebarWidth', newWidth.toString());
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHover(true);
    setMousePosition({ x: e.clientX, y: Math.max(e.clientY, 60) });
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleFold = () => {
    setIsOpen(!isOpen);
    setIsHover(false);
  };

  return (
    <div
      role="presentation"
      className={dragHandle}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHover && (
        <button
          type="button"
          className={foldButton}
          style={{
            top: `${mousePosition.y - 50}px`,
          }}
          onClick={handleFold}
          onKeyDown={handleFold}
        >
          {isOpen ? <SidebarCloseIcon color="black" /> : <SidebarOpenIcon color="black" />}
        </button>
      )}
    </div>
  );
};

const dragHandle = css({
  minWidth: '.2rem',
  width: { base: '.2rem', _hover: '1.5rem' },
  height: 'auto',
  my: '1.5rem',
  cursor: 'col-resize',
  borderRadius: '0 10px 10px 0 ',
  backgroundColor: { base: 'none', _hover: 'lightgray' },
  transition: '0.3s',
});

const foldButton = css({
  opacity: { base: 0.3, _hover: 1 },
  transition: '0.3s',
  cursor: 'pointer',
  position: 'relative',
  left: `0px`,
});

export default SideBarResizeHandle;
