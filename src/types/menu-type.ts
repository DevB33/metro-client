interface IMenuState {
  isSlashMenuOpen: boolean;
  slashMenuOpenIndex: number | null;
  isSelectionMenuOpen: boolean;
  slashMenuPosition: { x: number; y: number };
  selectionMenuPosition: { x: number; y: number };
}

export default IMenuState;
