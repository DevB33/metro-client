import { JSX } from 'react';

import { TBlockType } from '@/types/block-type';
import BoldIcon from '@/icons/bold-icon';
import ItalicIcon from '@/icons/italic-icon';
import UnderlineIcon from '@/icons/underline-icon';
import LineThroughIcon from '@/icons/line-through-icon';
import CodeblockIcon from '@/icons/codeblock-icon';
import HeadingOneIcon from '@/icons/heading-one-icon';
import HeadingTwoIcon from '@/icons/heading-two-icon';
import HeadingThreeIcon from '@/icons/heading-three-icon';
import BulletedListIcon from '@/icons/bulleted-list-icon';
import NumberedListIcon from '@/icons/numbered-list-icon';
import QuoteIcon from '@/icons/quote-icon';
import PageIcon from '@/icons/page-icon';
import TextIcon from '@/icons/text-icon';

const SELECTION_MENU_ITEMS: {
  label: string;
  icon: JSX.Element;
}[] = [
  { label: 'bold', icon: <BoldIcon color="black" /> },
  { label: 'italic', icon: <ItalicIcon color="black" /> },
  { label: 'underline', icon: <UnderlineIcon color="black" /> },
  { label: 'line-through', icon: <LineThroughIcon color="black" /> },
  { label: 'codeblock', icon: <CodeblockIcon color="black" /> },
];

const SLASH_MENU_ITEMS: {
  label: string;
  type: TBlockType;
  icon: JSX.Element;
  markdown: string;
}[] = [
  { label: 'Heading 1', type: 'H1', icon: <HeadingOneIcon color="black" />, markdown: '#' },
  { label: 'Heading 2', type: 'H2', icon: <HeadingTwoIcon color="black" />, markdown: '##' },
  { label: 'Heading 3', type: 'H3', icon: <HeadingThreeIcon color="black" />, markdown: '###' },
  { label: 'Bulleted List', type: 'UL', icon: <BulletedListIcon color="black" />, markdown: '-' },
  { label: 'Numbered List', type: 'OL', icon: <NumberedListIcon color="black" />, markdown: '1.' },
  { label: 'Quote', type: 'QUOTE', icon: <QuoteIcon color="black" />, markdown: '|' },
  { label: 'Page', type: 'PAGE', icon: <PageIcon color="black" />, markdown: '' },
  { label: 'Text', type: 'DEFAULT', icon: <TextIcon color="black" />, markdown: '' },
];

export { SELECTION_MENU_ITEMS, SLASH_MENU_ITEMS };
