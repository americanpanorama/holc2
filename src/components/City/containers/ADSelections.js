import { connect } from 'react-redux';
import ADSelections from '../presentational/ADSelections';
import areaDescSelections from '../../../../data/areaDescSelections.json';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  if (state.selectedCity.data
    && state.selectedCity.data.slug
    && areaDescSelections[state.selectedCity.data.slug]) {
    const { selectedCity, formsMetadata } = state;
    const { form_id: formId, slug } = selectedCity.data;
    const selections = shuffleArray(areaDescSelections[slug]).map((selection) => {
      let catName;
      const { cat, subcat } = selection;
      if (subcat) {
        catName = formsMetadata[formId][cat].subcats[subcat];
      } else if (cat) {
        catName = formsMetadata[formId][cat].header;
      }

      return {
        ...selection,
        catName,
      };
    });

    console.log(selections);

    return {
      selections,
      adId: state.selectedCity.data.id,
    };
  }

  return {};
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSelections);
