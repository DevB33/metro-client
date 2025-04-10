import React from 'react';
import { css } from '@/../styled-system/css';
import ResetIcon from '@/icons/reset-icon';

const controlStyles = css({ fontSize: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' });

interface Props {
  layout: string;
  linkType: string;
  stepPercent: number;
  setLayout: (layout: string) => void;
  setStepPercent: (percent: number) => void;
  resetColor?: () => void;
}

const resetButton = css({
  mx: '1rem',
  my: '0.5rem',
});

const LinkControls = ({ layout, linkType, stepPercent, setLayout, setStepPercent, resetColor }: Props) => {
  return (
    <div className={controlStyles}>
      <div>
        <label>layout:</label>&nbsp;
        <select onClick={e => e.stopPropagation()} onChange={e => setLayout(e.target.value)} value={layout}>
          <option value="cartesian">cartesian</option>
          <option value="polar">polar</option>
        </select>
        {linkType === 'step' && layout !== 'polar' && (
          <>
            &nbsp;&nbsp;
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
      <div className={resetButton} onClick={resetColor}>
        <ResetIcon />
      </div>
    </div>
  );
};

export default LinkControls;
