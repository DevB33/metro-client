interface INotes {
  id: string;
  parentId: string | null;
  order: number;
  title: string;
  icon: string;
  children: INotes[];
}

export default INotes;
