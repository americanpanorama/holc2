import React from 'react';
import PropTypes from 'prop-types';

const FormQualitative = ({ adData, selectCategory }) => (
  <div className="qualitative">
    {adData[1]}
  </div>
);

export default FormQualitative;

FormQualitative.propTypes = {
  adData: PropTypes.shape({
    1: PropTypes.string,
  }).isRequired,
  selectCategory: PropTypes.func.isRequired,
};
