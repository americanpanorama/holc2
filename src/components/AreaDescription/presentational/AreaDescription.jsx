import React from 'react';
import PropTypes from 'prop-types';

import HeaderArea from '../containers/HeaderArea';
import TranscriptionButton from '../containers/TranscriptionButton';
import ImageButton from '../containers/ImageButton';

const AreaDescription = ({ adData, FormComponent }) => (
  <div id="areaDescription">
    <HeaderArea />
    <div>
      <TranscriptionButton />
      <ImageButton />
    </div>
    <FormComponent
      adData={adData}
    />
  </div>
);

export default AreaDescription;

AreaDescription.propTypes = {
  adData: PropTypes.object,
  FormComponent: PropTypes.func.isRequired,
};

AreaDescription.defaultProps = {
  adData: undefined,
};
