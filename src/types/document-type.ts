interface IDocuments {
  id: string;
  title: string;
  icon: string;
  children: IDocuments[];
}

export default IDocuments;
