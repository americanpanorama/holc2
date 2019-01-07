import * as React from 'react';

const Sidebar = ({ children, className, style }) => {
  return (
    <div 
      className={`sidebar ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Sidebar;
