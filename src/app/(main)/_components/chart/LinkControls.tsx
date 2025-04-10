import React from 'react';

const controlStyles = { fontSize: 10 };

interface Props {
  layout: string;
  orientation: string;
  linkType: string;
  stepPercent: number;
  setLayout: (layout: string) => void;
  setOrientation: (orientation: string) => void;
  setStepPercent: (percent: number) => void;
}

const LinkControls = ({
  layout,
  orientation,
  linkType,
  stepPercent,
  setLayout,
  setOrientation,
  setStepPercent,
}: Props) => {
  return (
    <div style={controlStyles}>
      <label>layout:</label>&nbsp;
      <select onClick={e => e.stopPropagation()} onChange={e => setLayout(e.target.value)} value={layout}>
        <option value="cartesian">cartesian</option>
        <option value="polar">polar</option>
      </select>
      &nbsp;&nbsp;
      <label>orientation:</label>&nbsp;
      <select
        onClick={e => e.stopPropagation()}
        onChange={e => setOrientation(e.target.value)}
        value={orientation}
        disabled={layout === 'polar'}
      >
        <option value="vertical">vertical</option>
        <option value="horizontal">horizontal</option>
      </select>
      &nbsp;&nbsp;
      {linkType === 'step' && layout !== 'polar' && (
        <>
          &nbsp;&nbsp;
          <label>step:</label>&nbsp;
          <input
            onClick={e => e.stopPropagation()}
            type="range"
            min={0}
            max={1}
            step={0.1}
            onChange={e => setStepPercent(Number(e.target.value))}
            value={stepPercent}
            disabled={linkType !== 'step' || layout === 'polar'}
          />
        </>
      )}
    </div>
  );
};

export default LinkControls;
