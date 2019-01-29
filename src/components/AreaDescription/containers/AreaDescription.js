import { connect } from 'react-redux';
import ADImage from '../presentational/ADImage';
import FormQualitative from '../presentational/FormQualitative';
import Form19370203 from '../presentational/Form19370203';
import Form19371001 from '../presentational/Form19371001';
import Form19370203Curated from '../presentational/Form19370203Curated';
import Form19371001Curated from '../presentational/Form19371001Curated';
import Form1939 from '../presentational/Form1939';
import Form1939Curated from '../presentational/Form1939Curated';
import AreaDescription from '../presentational/AreaDescription';

const MapStateToProps = (state) => {
  const { selectedArea, selectedCity, showADSelections, showADTranscriptions } = state;
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

  if (!showADTranscriptions) {
    const { tileUrl, sheets } = state.selectedCity.data.areaDescriptions.byNeighborhood[state.selectedArea];
    let maxBounds = [[-10, -180], [90, -60]];
    if (sheets === 2) {
      maxBounds = [[-10, -180], [90, 70]];
    }
    adData = {
      center: [-125, 75],
      zoom: 3,
      maxBounds,
      url: tileUrl,
      style: state.dimensions.ADImageStyle,
    };
    FormComponent = ADImage;
  }

  if (showADTranscriptions && selectedArea && selectedCity.data
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

export default connect(MapStateToProps)(AreaDescription);
