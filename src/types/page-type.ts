interface IPageType {
  id: string;
  title: string;
  icon: string;
  children: IPageType[];
}

export default IPageType;
