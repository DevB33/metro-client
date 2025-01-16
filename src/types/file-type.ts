interface IFileType {
  docsId: number;
  title: string;
  icon: string;
  children: IFileType[];
}

export default IFileType;
