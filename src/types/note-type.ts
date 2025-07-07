interface INotes {
  id: string;
  parentId: string;
  order: number;
  title: string;
  icon: string;
  children: INotes[];
}

export default INotes;
