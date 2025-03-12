import ISelectionPosition from '@/types/selection-position';

const handleMouseLeave = (
  index: number,
  isDragging: boolean,
  isUp: boolean,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
) => {
  if (!isDragging) return;

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);

  // 시작 블록에서 떠날 때
  if (index === selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex) {
    let left = 99999;
    let right = 0;
    if (!isUp) {
      // 아래로 떠날 때
      childNodes.forEach((childNode, idx) => {
        const range = document.createRange();
        if (idx > selectionStartPosition.childNodeIndex) {
          range.setStart(childNode as Node, 0);
          range.setEnd(childNode as Node, childNode.textContent?.length || 0);
        } else if (idx === selectionStartPosition.childNodeIndex) {
          range.setStart(childNode as Node, selectionStartPosition.offset);
          range.setEnd(childNode as Node, childNode.textContent?.length || 0);
        } else {
          return;
        }

        const rect = range.getBoundingClientRect();

        if (left > rect.left) {
          left = rect.left;
        }

        if (right < rect.right) {
          right = rect.right;
        }
      });
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left || 0;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
        transparent ${left - elLeft}px,
        lightblue ${left - elLeft}px,
        lightblue ${right - elLeft}px,
        transparent ${right - elLeft}px)`;
    } else {
      // 위로 떠날 때
      childNodes.forEach((childNode, idx) => {
        const range = document.createRange();
        if (idx < selectionStartPosition.childNodeIndex) {
          range.setStart(childNode as Node, 0);
          range.setEnd(childNode as Node, childNode.textContent?.length || 0);
        } else if (idx === selectionStartPosition.childNodeIndex) {
          range.setStart(childNode as Node, 0);
          range.setEnd(childNode as Node, selectionStartPosition.offset);
        } else {
          return;
        }

        const rect = range.getBoundingClientRect();
        if (left > rect.left) {
          left = rect.left;
        }

        if (right < rect.right) {
          right = rect.right;
        }
      });
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left || 0;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
        transparent ${left - elLeft}px,
        lightblue ${left - elLeft}px,
        lightblue ${right - elLeft}px,
        transparent ${right - elLeft}px)`;
    }
  }

  // 아래로 드래그한 상태 일때
  if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
    let left = 99999;
    let right = 0;
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
      // 아래로 드래그 할 때
      childNodes.forEach(childNode => {
        const range = document.createRange();
        range.setStart(childNode as Node, 0);
        range.setEnd(childNode as Node, childNode.textContent?.length || 0);
        const rect = range.getBoundingClientRect();
        if (left > rect.left) {
          left = rect.left;
        }

        if (right < rect.right) {
          right = rect.right;
        }
      });
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left || 0;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
          transparent ${left - elLeft}px,
          lightblue ${left - elLeft}px,
          lightblue ${right - elLeft}px,
          transparent ${right - elLeft}px)`;
    } else if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
      // 위로 드래그 할 때
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }
  } else {
    // 위로 드래그한 상태 일 때
    let left = 99999;
    let right = 0;
    // eslint-disable-next-line no-lonely-if
    if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && isUp) {
      // 위로 드래그 할 때
      childNodes.forEach(childNode => {
        const range = document.createRange();
        range.setStart(childNode as Node, 0);
        range.setEnd(childNode as Node, childNode.textContent?.length || 0);
        const rect = range.getBoundingClientRect();
        if (left > rect.left) {
          left = rect.left;
        }

        if (right < rect.right) {
          right = rect.right;
        }
      });
      const el = blockRef.current[index];
      const elLeft = el?.getBoundingClientRect().left || 0;
      if (!el) return;
      el.style.backgroundImage = `linear-gradient(to right,
          transparent ${left - elLeft}px,
          lightblue ${left - elLeft}px,
          lightblue ${right - elLeft}px,
          transparent ${right - elLeft}px)`;
    } else if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex && !isUp) {
      // 아래로 드래그 할 때
      const el = blockRef.current[index];
      if (!el) return;
      el.style.backgroundImage = `none`;
    }
  }
};

export default handleMouseLeave;
