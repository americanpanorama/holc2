import React from 'react';
import PropTypes from 'prop-types';

import HeaderArea from '../containers/HeaderArea';
import TranscriptionButton from '../containers/TranscriptionButton';
import ViewAllADsButton from '../containers/ViewAllADsButton';
import ImageButton from '../containers/ImageButton';

const AreaDescription = ({ adData, FormComponent, formId, selectCategory }) => (
  <div id="areaDescription">
    <HeaderArea />
    <div className="controls">
      {(formId === 1) ? <ViewAllADsButton /> : <TranscriptionButton />}
      <ImageButton />
    </div>
    { (adData) ? (
      <FormComponent
        adData={adData}
        selectCategory={selectCategory}
      />
    ) : (
      <p className="explanation">
        This area description has not yet been transcripted.
      </p>
    )}
  </div>
);


export default AreaDescription;

AreaDescription.propTypes = {
  adData: PropTypes.object,
  FormComponent: PropTypes.func,
  selectCategory: PropTypes.func.isRequired,
  formId: PropTypes.number.isRequired,
};

AreaDescription.defaultProps = {
  adData: undefined,
  FormComponent: undefined,
};
