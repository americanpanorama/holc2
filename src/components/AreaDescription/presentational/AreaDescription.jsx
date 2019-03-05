import React from 'react';
import PropTypes from 'prop-types';

import HeaderArea from '../containers/HeaderArea';
import TranscriptionButton from '../containers/TranscriptionButton';
import ImageButton from '../containers/ImageButton';

const AreaDescription = ({ adData, FormComponent, selectCategory }) => (
  <div id="areaDescription">
    <HeaderArea />
    <div className="controls">
      <TranscriptionButton />
      <ImageButton />
    </div>
    <FormComponent
      adData={adData}
      selectCategory={selectCategory}
    />
  </div>
);

export default AreaDescription;

AreaDescription.propTypes = {
  adData: PropTypes.object,
  FormComponent: PropTypes.func.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

AreaDescription.defaultProps = {
  adData: undefined,
};
