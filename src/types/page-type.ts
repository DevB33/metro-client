interface IPageType {
  pageId: number;
  title: string;
  icon: string;
  children: IPageType[];
}

export default IPageType;
