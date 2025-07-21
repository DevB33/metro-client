import LINE_COLOR from '@/constants/line-color';

interface ITagType {
  name: string;
  color: keyof typeof LINE_COLOR;
}

export default ITagType;
