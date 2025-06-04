interface ISelectionPosition {
  start: {
    blockId: string;
    blockIndex: number;
    childNodeIndex: number;
    offset: number;
  };
  end: {
    blockId: string;
    blockIndex: number;
    childNodeIndex: number;
    offset: number;
  };
}

export default ISelectionPosition;
