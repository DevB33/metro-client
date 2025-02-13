interface IDocuments {
  docsId: number;
  title: string;
  icon: string;
  children: IDocuments[];
}

export default IDocuments;
