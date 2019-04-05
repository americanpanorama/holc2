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
import { getSelectedCityData, getSelectedAreaDescription } from '../../../store/selectors';

const MapStateToProps = (state) => {
  const cityData = getSelectedCityData(state);
  const areaDescription = getSelectedAreaDescription(state);
  const adData = (areaDescription && areaDescription.areaDesc && Object.keys(areaDescription.areaDesc).length > 0)
    ? areaDescription.areaDesc : undefined;
  const { showADSelections } = state;
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

  if (cityData.form_id) {
    const { form_id: formId } = cityData;
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
