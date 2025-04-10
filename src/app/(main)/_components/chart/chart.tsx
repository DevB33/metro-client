'use client';

import React, { useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import LineColor from '@/constants/line-color';
import useSWR from 'swr';
import useForceUpdate from './useForceUpdate';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';
import { css } from '../../../../../styled-system/css';

interface ITreeNode {
  name: string;
  children?: ITreeNode[];
}

const colorMap: Record<keyof typeof LineColor, string> = {
  LINE_ONE: '#034983',
  LINE_TWO: '#01A140',
  LINE_THREE: '#EE6C0D',
  LINE_FOUR: '#009DCC',
  LINE_FIVE: '#794597',
  LINE_SIX: '#7C4A32',
};

const data: ITreeNode = {
  name: 'T',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
            {
              name: 'D',
              children: [
                {
                  name: 'D1',
                },
                {
                  name: 'D2',
                },
                {
                  name: 'D3',
                  children: [{ name: 'E1' }],
                },
              ],
            },
          ],
        },
      ],
    },
    { name: 'Z' },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    },
  ],
};

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export interface ILinkTypesProps {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const Example = ({ width: totalWidth, height: totalHeight, margin = defaultMargin }: ILinkTypesProps) => {
  const [layout, setLayout] = useState<string>('cartesian');
  const orientation = 'horizontal';
  const linkType = 'step';
  const [stepPercent, setStepPercent] = useState<number>(0.5);

  const { data: pageList } = useSWR('pageList');

  function convertPageListToTree(pages: any[]): ITreeNode[] {
    return pages.map(page => ({
      name: page.title ?? page.id, // title이 있으면 사용, 없으면 id fallback
      children: convertPageListToTree(page.children || []),
    }));
  }

  console.log(convertPageListToTree(pageList.node));

  const treeData: ITreeNode = {
    name: 'Root',
    children: convertPageListToTree(pageList.node),
  };

  const STORAGE_KEY = 'tree-node-colors';

  function getStoredColors(): Record<string, keyof typeof LineColor> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  function saveColorsToStorage(colors: Record<string, keyof typeof LineColor>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  }

  function assignColorRecursively(
    node: any,
    parentColorKey?: keyof typeof LineColor,
    colorMapFromStorage?: Record<string, keyof typeof LineColor>,
    colorMapToStore?: Record<string, keyof typeof LineColor>,
  ) {
    const nodeId = node.data.name; // 고유 ID 기준 – 필요 시 data.id 등으로 변경

    if (colorMapFromStorage && colorMapFromStorage[nodeId]) {
      node.data.colorKey = colorMapFromStorage[nodeId];
    } else if (node.depth === 0) node.data.colorKey = 'LINE_ONE';
    else if (node.depth === 1) {
      const colorKeys = Object.keys(LineColor) as (keyof typeof LineColor)[];
      const randomKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
      node.data.colorKey = randomKey;
      colorMapToStore![nodeId] = randomKey;
    } else if (parentColorKey) {
      node.data.colorKey = parentColorKey;
      colorMapToStore![nodeId] = parentColorKey;
    }

    node.children?.forEach((child: any) =>
      assignColorRecursively(child, node.data.colorKey, colorMapFromStorage, colorMapToStore),
    );
  }

  function resetStoredColors() {
    localStorage.removeItem(STORAGE_KEY);
    // 페이지 리로드로 트리 다시 초기화
    window.location.reload();
  }

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  if (layout === 'polar') {
    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2,
    };
    sizeWidth = Math.PI * 2; // <--- 더 넓은 각도
    sizeHeight = Math.min(innerWidth, innerHeight) / 1.5; // <--- 더 큰 반지름
  } else {
    origin = { x: 0, y: 0 };
    sizeWidth = innerHeight;
    sizeHeight = innerWidth;
  }

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  const storedColors = getStoredColors();
  const newColors: Record<string, keyof typeof LineColor> = {};

  const root = hierarchy(treeData, d => d.children);
  assignColorRecursively(root, undefined, storedColors, newColors);

  if (typeof window !== 'undefined' && Object.keys(storedColors).length === 0) {
    saveColorsToStorage(newColors);
  }

  const isUUID = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  return totalWidth < 10 ? null : (
    <div>
      <button
        onClick={resetStoredColors}
        className="mb-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
      >
        색상 리셋
      </button>

      <LinkControls
        layout={layout}
        linkType={linkType}
        stepPercent={stepPercent}
        setLayout={setLayout}
        setStepPercent={setStepPercent}
        resetColor={resetStoredColors}
      />
      <svg width={totalWidth} height={totalHeight}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
        <rect width={totalWidth} height={totalHeight} fill="white" strokeWidth={1.5} stroke="black" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(treeData, d => d.children)}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => {
              if (layout === 'polar') {
                return a.parent === b.parent ? 2.5 : 2.5; // polar는 더 넓게
              }
              return a.parent === b.parent ? 2.5 : 2; // cartesian 기본값
            }}
          >
            {tree => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => {
                  const colorKey = link.source.data.colorKey as keyof typeof colorMap;
                  const strokeColor = colorMap[colorKey];

                  return (
                    <LinkComponent
                      key={i}
                      data={link}
                      percent={stepPercent}
                      stroke={strokeColor}
                      strokeWidth={3}
                      fill="none"
                    />
                  );
                })}

                {tree.descendants().map((node, key) => {
                  const width = 40;
                  const height = 20;

                  let top: number;
                  let left: number;
                  if (layout === 'polar') {
                    const [radialX, radialY] = pointRadial(node.x, node.y);
                    top = radialY;
                    left = radialX;
                  } else {
                    top = node.x;
                    left = node.y;
                  }

                  return (
                    <Group top={top} left={left} key={key}>
                      <circle r={12} fill="none" stroke="#000" strokeWidth={2} />

                      {/* 중간 흰색 테두리 */}
                      <circle r={10} fill="#fff" stroke="none" />

                      {/* 안쪽 실제 색상 (LineColor) */}
                      <circle r={9} fill={colorMap[node.data.colorKey as keyof typeof colorMap]} stroke="none" />
                      <text
                        y={-20} // ✅ 원 위로 올림 (r=12보다 살짝 위)
                        fontSize={12}
                        fontFamily="Arial"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                        fill="#000"
                      >
                        {isUUID(node.data.name) ? '새 페이지' : node.data.name}
                      </text>
                    </Group>
                  );
                })}
              </Group>
            )}
          </Tree>
        </Group>
      </svg>
    </div>
  );
};

export default Example;
