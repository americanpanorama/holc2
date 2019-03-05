import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../City/containers/Header';
import Category from '../../AreaDescription/containers/Category';

const DataViewerFull = ({ show, close }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      id="dataViewerFull"
    >
      <Header />
      
      { (show === 'category') && (
        <Category />
      )}
    </div>
  );
};

export default DataViewerFull;

DataViewerFull.propTypes = {
  show: PropTypes.string,
  close: PropTypes.func.isRequired,
};

DataViewerFull.defaultProps = {
  show: undefined,
};
