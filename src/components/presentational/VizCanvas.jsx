import React from 'react';
import PropTypes from 'prop-types';

const VizCanvas = ({ VizComponent, show }) => (
  <article id="vizCanvas">
    {(show)
      ? <VizComponent />
      : null
    }
  </article>
);

export default VizCanvas;

VizCanvas.propTypes = {
  VizComponent: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
