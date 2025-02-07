import LineColor from '@/constants/line-color';

interface ITagType {
  name: string;
  color: keyof typeof LineColor;
}

export default ITagType;
