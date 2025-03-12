import ISelectionPosition from '@/types/selection-position';

const handleMouseMove = (
  event: React.MouseEvent<HTMLDivElement>,
  index: number,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  isDragging: boolean,
  selectionStartPosition: ISelectionPosition,
  selectionEndPosition: ISelectionPosition,
  setSelectionEndPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
  setIsUp: React.Dispatch<React.SetStateAction<boolean>>,
  prevClientY: React.RefObject<number>,
) => {
  if (!isDragging) return;

  if (index !== selectionEndPosition.blockIndex) {
    setSelectionEndPosition((prev: ISelectionPosition) => ({
      ...prev,
      blockIndex: index,
    }));
  }

  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  if (currentChildNodeIndex !== selectionEndPosition.childNodeIndex) {
    setSelectionEndPosition((prev: ISelectionPosition) => ({
      ...prev,
      childNodeIndex: currentChildNodeIndex,
    }));
  }

  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  setSelectionEndPosition((prev: ISelectionPosition) => ({
    ...prev,
    offset: charIdx,
  }));

  // 첫 번째 블록에서
  if (index === selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex) {
    if (currentChildNodeIndex < selectionStartPosition.childNodeIndex) {
      // 왼쪽으로 드래그
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        if (idx <= selectionStartPosition.childNodeIndex && idx >= currentChildNodeIndex) {
          const range = document.createRange();
          if (selectionStartPosition.childNodeIndex === idx) {
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, selectionStartPosition.offset);
          } else if (currentChildNodeIndex < idx && selectionStartPosition.childNodeIndex > idx) {
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
          } else if (currentChildNodeIndex === idx) {
            range.setStart(childNode as Node, charIdx);
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
      // 오른쪽으로 드래그
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        if (idx <= currentChildNodeIndex && idx >= selectionStartPosition.childNodeIndex) {
          const range = document.createRange();

          if (currentChildNodeIndex === idx && selectionStartPosition.childNodeIndex === idx) {
            if (selectionStartPosition.offset < charIdx) {
              range.setStart(childNode as Node, selectionStartPosition.offset);
              range.setEnd(childNode as Node, charIdx);
            } else {
              range.setStart(childNode as Node, charIdx);
              range.setEnd(childNode as Node, selectionStartPosition.offset);
            }
          } else {
            // eslint-disable-next-line no-lonely-if
            if (currentChildNodeIndex === idx) {
              range.setStart(childNode as Node, 0);
              range.setEnd(childNode as Node, charIdx);
            } else if (selectionStartPosition.childNodeIndex < idx && currentChildNodeIndex > idx) {
              range.setStart(childNode as Node, 0);
              range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            } else if (selectionStartPosition.childNodeIndex === idx) {
              range.setStart(childNode as Node, selectionStartPosition.offset);
              range.setEnd(childNode as Node, childNode.textContent?.length || 0);
            }
          }

          const rect = range.getBoundingClientRect();
          if (left > rect.left) {
            left = rect.left;
          }

          if (right < rect.right) {
            right = rect.right;
          }
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

  // 마지막 블록에서
  if (index !== selectionStartPosition.blockIndex && index === selectionEndPosition.blockIndex) {
    if (selectionStartPosition.blockIndex < selectionEndPosition.blockIndex) {
      // 아래로 드래그 된 상태일 때
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        if (idx <= currentChildNodeIndex) {
          const range = document.createRange();

          if (currentChildNodeIndex === idx) {
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, charIdx);
          } else {
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
          }

          const rect = range.getBoundingClientRect();
          if (left > rect.left) {
            left = rect.left;
          }

          if (right < rect.right) {
            right = rect.right;
          }
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
      // 위로 드래그 된 상태일 때
      let left = 99999;
      let right = 0;
      childNodes.forEach((childNode, idx) => {
        if (idx >= currentChildNodeIndex) {
          const range = document.createRange();

          if (currentChildNodeIndex === idx) {
            range.setStart(childNode as Node, charIdx);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
          } else {
            range.setStart(childNode as Node, 0);
            range.setEnd(childNode as Node, childNode.textContent?.length || 0);
          }

          const rect = range.getBoundingClientRect();
          if (left > rect.left) {
            left = rect.left;
          }

          if (right < rect.right) {
            right = rect.right;
          }
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

  if (prevClientY.current < event.clientY) {
    setIsUp(false);
    // eslint-disable-next-line no-param-reassign
    prevClientY.current = event.clientY;
  } else if (prevClientY.current > event.clientY) {
    setIsUp(true);
    // eslint-disable-next-line no-param-reassign
    prevClientY.current = event.clientY;
  }
};

export default handleMouseMove;
