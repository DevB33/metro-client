interface IMenuState {
  isSlashMenuOpen: boolean;
  isSelectionMenuOpen: boolean;
  slashMenuPosition: { x: number; y: number };
  selectionMenuPosition: { x: number; y: number };
}

export default IMenuState;
