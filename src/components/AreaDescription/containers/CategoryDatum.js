import { connect } from 'react-redux';

import CategoryDatum from '../presentational/CategoryDatum';
import CategoryDatumSimple from '../presentational/CategoryDatumSimple';
import PercentPredominating from '../presentational/PercentPredominating';
import IncreasingDecreasingStatic from '../presentational/IncreasingDecreasingStatic';
import Cat1a from '../Form1939/presentational/Cat1a';
import Cat1c from '../Form1939/presentational/Cat1c';
import { selectArea, highlightArea, unhighlightArea } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const components = {
    Form19370203: {
      Cat5c: PercentPredominating,
      Cat5d: PercentPredominating,
      Cat5g: IncreasingDecreasingStatic,
    },
    Form19371001: {
      Cat2c: PercentPredominating,
      Cat2d: PercentPredominating,
      Cat2g: IncreasingDecreasingStatic,
    },
    Form1939: {
      Cat1a,
      Cat1c,
    },
  };

  const { selectedCategory, areaDescriptions } = state;
  const cityData = getSelectedCityData(state);
  let CategoryComponent = CategoryDatumSimple;
  let adId;

  if (selectedCategory && cityData && areaDescriptions) {
    const { form_id: formId, ad_id } = cityData;
    adId = ad_id;
    const [cat, subcat] = selectedCategory.split('-');
    CategoryComponent = (components[`Form${formId}`] && components[`Form${formId}`][`Cat${cat}${subcat}`])
      ? components[`Form${formId}`][`Cat${cat}${subcat}`] : CategoryDatumSimple;
  }

  return {
    adId,
    CategoryComponent,
  };
};

const mapDispatchToProps = {
  selectArea,
  highlightArea,
  unhighlightArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDatum);
