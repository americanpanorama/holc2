import { connect } from 'react-redux';
import FormQualitative from '../presentational/FormQualitative';
import Form19370203 from '../Form19370203/presentational/Full';
import Form19371001 from '../Form19371001/presentational/Full';
import Form1939 from '../Form1939/presentational/Full';
import Form19370203Curated from '../Form19370203/presentational/Selected';
import Form19371001Curated from '../Form19371001/presentational/Selected';
import Form1939Curated from '../Form1939/presentational/Selected';
import AreaDescription from '../presentational/AreaDescription';

import { selectCategory } from '../../../store/Actions';

const MapStateToProps = (state) => {
  const { selectedArea, selectedCity, showADSelections } = state;
  let adData = null;
  const formComponents = {
    full: {
      1: FormQualitative,
      19370203: Form19370203,
      19370601: Form19370203,
      19370826: Form19370203,
      19371001: Form19371001,
      1939: Form1939,
    },
    selected: {
      1: FormQualitative,
      19370203: Form19370203Curated,
      19370601: Form19370203Curated,
      19370826: Form19370203Curated,
      19371001: Form19371001Curated,
      1939: Form1939Curated,
    },
  };

  let FormComponent;

  if (selectedArea && selectedCity.data
    && selectedCity.data.areaDescriptions
    && selectedCity.data.areaDescriptions.byNeighborhood[selectedArea]
    && selectedCity.data.areaDescriptions.byNeighborhood[selectedArea].areaDesc) {
    const { form_id: formId, byNeighborhood } = selectedCity.data.areaDescriptions;
    adData = byNeighborhood[selectedArea].areaDesc;
    FormComponent = (showADSelections) ? formComponents.selected[formId]
      : formComponents.full[formId];
  }
  return {
    adData,
    FormComponent,
  };
};

const MapDispatchToState = {
  selectCategory,
};

export default connect(MapStateToProps, MapDispatchToState)(AreaDescription);
