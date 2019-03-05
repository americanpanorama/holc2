import React from 'react';
import PropTypes from 'prop-types';

const ADSearch = ({ areaDescriptions }) => {
  console.log(areaDescriptions);
  return (
  );
};

export default ADSearch;

ADSearch.propTypes = {
  areaDescriptions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ADSearch.defaultProps = {
  
};
