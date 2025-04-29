interface ISelectionPosition {
  start: {
    blockIndex: number;
    childNodeIndex: number;
    offset: number;
  };
  end: {
    blockIndex: number;
    childNodeIndex: number;
    offset: number;
  };
}

export default ISelectionPosition;
