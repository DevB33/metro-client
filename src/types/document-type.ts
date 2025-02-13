interface IDocuments {
  id: number;
  title: string;
  icon: string;
  children: IDocuments[];
}

export default IDocuments;
