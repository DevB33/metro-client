import ISelectionPosition from '@/types/selection-position';
import { text } from 'stream/consumers';

const handleMouseDown = (
  event: React.MouseEvent<HTMLDivElement>,
  blockRef: React.RefObject<(HTMLDivElement | null)[]>,
  index: number,
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  setSelectionStartPosition: React.Dispatch<React.SetStateAction<ISelectionPosition>>,
  setStartPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) => {
  const parent = blockRef.current[index];
  const childNodes = Array.from(parent?.childNodes as NodeListOf<HTMLElement>);
  const textNode = document.caretPositionFromPoint(event.clientX, event.clientY)?.offsetNode;
  const element =
    textNode.nodeType === Node.TEXT_NODE ? (textNode.parentNode as HTMLElement) : (textNode as HTMLElement);
  if (element) {
    const rect = element.getBoundingClientRect();
    setStartPosition({ x: rect.left, y: rect.top });
    console.log('클릭한 노드의 좌표:', rect.left, rect.top);
  }

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
      (blockRef.current[index]?.parentNode as HTMLElement)?.focus();
      const selection = window.getSelection();
      if (currentChildNodeIndex === -1) return;
      range?.setStart(blockRef.current[index]?.childNodes[currentChildNodeIndex] as Node, charIdx);

      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, 0);
};

export default handleMouseDown;
