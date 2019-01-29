import React from 'react';
import PropTypes from 'prop-types';

const FormQualitative = ({ adData }) => (
  <div className="area_description qualitative">
    {adData[1]}
  </div>
);

export default FormQualitative;

FormQualitative.propTypes = {
  adData: PropTypes.shape({
    1: PropTypes.string,
  }).isRequired,
};
