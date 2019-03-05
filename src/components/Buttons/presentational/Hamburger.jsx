import * as React from 'react';

const HamburgerIcon = props => (
  <svg
    width='100%'
    height='100%'
  >
    <g>
      <circle
        cx='50%'
        cy='50%'
        r='50%'
        fillOpacity={1}
        className='background'
      />
      <line
        x1='25%'
        x2='75%'
        y1='30%'
        y2='30%'
        strokeWidth='10%'
      />
      <line
        x1='25%'
        x2='75%'
        y1='50%'
        y2='50%'
        strokeWidth='10%'
      />
      <line
        x1='25%'
        x2='75%'
        y1='70%'
        y2='70%'
        strokeWidth='10%'
      />
    </g>
  </svg>
);

export default HamburgerIcon;
