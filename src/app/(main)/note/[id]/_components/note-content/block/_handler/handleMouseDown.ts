import ISelectionPosition from '@/types/selection-position';

const handleMouseDown = (
  event: React.MouseEvent<HTMLDivElement>,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  setSelectionStartPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
) => {
  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;

  const currentChildNodeIndex =
    childNodes.indexOf(textNode as HTMLElement) === -1 && textNode?.nodeType === Node.TEXT_NODE
      ? childNodes.indexOf(textNode.parentNode as HTMLElement)
      : childNodes.indexOf(textNode as HTMLElement);

  setIsDragging(true);
  setIsTyping(false);
  setKey(Math.random());

  const range = document.createRange();
  const charIdx = document.caretPositionFromPoint(event.clientX, event.clientY)?.offset as number;

  setSelectionStartPosition({
    blockIndex: index,
    childNodeIndex: currentChildNodeIndex,
    offset: charIdx,
  });

  setTimeout(() => {
    if (range) {
      console.log('setTIMEOUT----range');
      (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      const selection = window.getSelection();
      if (currentChildNodeIndex === -1) return;

      // range?.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);

      const targetNode = blockRef.current[index]?.childNodes[currentChildNodeIndex];
      if (!targetNode) return;
      if (targetNode.nodeType === Node.TEXT_NODE) {
        // 텍스트 노드일 때
        range.setStart(targetNode, Math.min(charIdx, targetNode.textContent?.length ?? 0));
      } else if (targetNode.firstChild && targetNode.firstChild.nodeType === Node.TEXT_NODE) {
        // span 같은 엘리먼트 노드에 텍스트가 있을 경우
        range.setStart(targetNode.firstChild, Math.min(charIdx, targetNode.firstChild.textContent?.length ?? 0));
      } else {
        range.setStart(targetNode, 0);
      }

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, 0);
};

export default handleMouseDown;
