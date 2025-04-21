import React from 'react';
import { css } from '@/../styled-system/css';
import ResetIcon from '@/icons/reset-icon';

const controlStyles = css({ fontSize: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' });

interface Props {
  layout: string;
  setLayout: (layout: string) => void;
  resetColor?: () => void;
}

const resetButton = css({
  mx: '1rem',
  my: '0.5rem',
});

const LinkControls = ({ layout, setLayout, resetColor }: Props) => {
  return (
    <div className={controlStyles}>
      <div>
        <label>layout:</label>&nbsp;
        <select onClick={e => e.stopPropagation()} onChange={e => setLayout(e.target.value)} value={layout}>
          <option value="cartesian">line</option>
          <option value="polar">polar</option>
        </select>
      </div>
      <div className={resetButton} onClick={resetColor}>
        <ResetIcon />
      </div>
    </div>
  );
};

export default LinkControls;
