interface INotes {
  id: string;
  title: string;
  icon: string;
  children: INotes[];
}

export default INotes;
