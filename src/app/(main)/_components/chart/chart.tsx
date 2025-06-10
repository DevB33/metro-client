'use client';

import React, { useEffect, useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import LineColor from '@/constants/line-color';
import useSWR from 'swr';
import { Zoom } from '@visx/zoom';
import { useRouter } from 'next/navigation';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';

const colorMap: Record<keyof typeof LineColor, string> = {
  LINE_ONE: '#034983',
  LINE_TWO: '#01A140',
  LINE_THREE: '#EE6C0D',
  LINE_FOUR: '#009DCC',
  LINE_FIVE: '#794597',
  LINE_SIX: '#7C4A32',
};

interface ITreeNode {
  name: string;
  id: string;
  colorKey: keyof typeof LineColor;
  children?: ITreeNode[];
}

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export interface ILinkTypesProps {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const LineChart = ({ width: totalWidth, height: totalHeight, margin = defaultMargin }: ILinkTypesProps) => {
  const STORAGE_KEY_LAYOUT = 'tree-layout';

  const [layout, setLayoutState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'cartesian';
    return localStorage.getItem(STORAGE_KEY_LAYOUT) ?? 'cartesian';
  });

  const setLayout = (layoutState: string) => {
    setLayoutState(layoutState);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LAYOUT, layoutState);
    }
  };

  const [isMouseOverChart, setIsMouseOverChart] = useState(false);
  const orientation = 'horizontal';
  const linkType = 'step';
  const stepPercent = 0.7;

  const router = useRouter();

  const { data: noteList } = useSWR('noteList');

  const convertNoteListToTree = (notes: any[]): ITreeNode[] => {
    return notes.map(note => ({
      name: note.title ?? note.id,
      id: note.id,
      colorKey: 'LINE_ONE',
      children: convertNoteListToTree(note.children || []),
    }));
  };

  const treeData: ITreeNode = {
    name: 'WorkSpace',
    id: '',
    colorKey: 'LINE_ONE',
    children: convertNoteListToTree(noteList),
  };

  const STORAGE_KEY = 'tree-node-colors';

  const getStoredColors = (): Record<string, keyof typeof LineColor> => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const saveColorsToStorage = (colors: Record<string, keyof typeof LineColor>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  };

  const resetStoredColors = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const assignColorRecursively = (
    node: any,
    parentColorKey?: keyof typeof LineColor,
    colorMapFromStorage?: Record<string, keyof typeof LineColor>,
    colorMapToStore?: Record<string, keyof typeof LineColor>,
  ) => {
    const nodeId = node.data.id;

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
  };
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
    sizeWidth = Math.PI * 2;
    sizeHeight = Math.min(innerWidth, innerHeight) / 1.5;
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

  const openNote = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isMouseOverChart) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMouseOverChart]);

  useEffect(() => {
    if (!noteList) return;

    const merged = { ...getStoredColors(), ...newColors };
    saveColorsToStorage(merged);
  }, [noteList]);

  return totalWidth < 10 ? null : (
    <div>
      <LinkControls layout={layout} setLayout={setLayout} resetColor={resetStoredColors} />
      <Zoom width={totalWidth} height={totalHeight} scaleXMin={0.1} scaleXMax={4} scaleYMin={0.1} scaleYMax={4}>
        {zoom => (
          <svg
            width={totalWidth}
            height={totalHeight}
            style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={zoom.dragStart}
            onMouseMove={zoom.dragMove}
            onMouseUp={zoom.dragEnd}
            onWheel={event => {
              const scaleAmount = 1 - event.deltaY * 0.001;
              zoom.scale({ scaleX: scaleAmount, scaleY: scaleAmount });
            }}
            onMouseEnter={() => setIsMouseOverChart(true)}
            onMouseLeave={() => {
              zoom.dragEnd();
              setIsMouseOverChart(false);
            }}
          >
            <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
            <rect width={totalWidth} height={totalHeight} fill="white" strokeWidth={1.5} stroke="grey" />
            <Group top={margin.top} left={margin.left} transform={zoom.toString()}>
              <Tree
                root={hierarchy(treeData, d => d.children)}
                size={[sizeWidth, sizeHeight]}
                separation={(a, b) => {
                  if (layout === 'polar') {
                    return a.parent === b.parent ? 2.5 : 2.5;
                  }
                  return a.parent === b.parent ? 4 : 2;
                }}
              >
                {tree => (
                  <Group top={origin.y} left={origin.x}>
                    {tree.links().map(link => {
                      const colorKey = link.source.data.colorKey as keyof typeof colorMap;
                      const strokeColor = colorMap[colorKey];

                      return (
                        <LinkComponent
                          key={`${link.source.data.id}-${link.target.data.id}`}
                          data={link}
                          percent={stepPercent}
                          stroke={strokeColor}
                          strokeWidth={3}
                          fill="none"
                        />
                      );
                    })}

                    {tree.descendants().map(node => {
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
                        <Group
                          top={top}
                          left={left}
                          key={node.data.id}
                          onClick={e => {
                            e.stopPropagation();
                            if (node.depth === 0) return;
                            setTimeout(() => openNote(node.data.id), 0);
                          }}
                        >
                          <circle r={12} fill="none" stroke="#000" strokeWidth={2} />
                          <circle r={10} fill="#fff" stroke="none" />
                          <circle r={9} fill={colorMap[node.data.colorKey as keyof typeof colorMap]} stroke="none" />
                          <text
                            y={-20}
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
        )}
      </Zoom>
    </div>
  );
};

export default LineChart;
