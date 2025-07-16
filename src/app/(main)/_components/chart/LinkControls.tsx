import React from 'react';
import { css } from '@/../styled-system/css';

import ResetIcon from '@/icons/reset-icon';

const controlStyles = css({ fontSize: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' });

interface ILinkControlsProps {
  layout: string;
  setLayout: (layout: string) => void;
  resetColor?: () => void;
}

const LinkControls = ({ layout, setLayout, resetColor }: ILinkControlsProps) => {
  return (
    <div className={controlStyles}>
      <div>
        <label htmlFor="layout-select">
          layout:
          <select onClick={e => e.stopPropagation()} onChange={e => setLayout(e.target.value)} value={layout}>
            <option value="cartesian">line</option>
            <option value="polar">polar</option>
          </select>
        </label>
        &nbsp;
      </div>
      <button type="button" className={resetButton} onClick={resetColor}>
        <ResetIcon />
      </button>
    </div>
  );
};

const resetButton = css({
  mx: '1rem',
  my: '0.5rem',
});

export default LinkControls;
