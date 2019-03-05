import React from 'react';
import PropTypes from 'prop-types';

const VizCanvas = ({ VizComponent }) => (
  <article id="vizCanvas">
    <VizComponent />
  </article>
);

export default VizCanvas;

VizCanvas.propTypes = {
  VizComponent: PropTypes.func.isRequired,
};
