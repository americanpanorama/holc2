import { connect } from 'react-redux';

import CategoryDatum from '../presentational/CategoryDatum';
import CategoryDatumSimple from '../presentational/CategoryDatumSimple';
import PercentPredominating from '../presentational/PercentPredominating';
import IncreasingDecreasingStatic from '../presentational/IncreasingDecreasingStatic';
import Cat1a from '../Form1939/presentational/Cat1a';
import Cat1c from '../Form1939/presentational/Cat1c';
import { selectArea } from '../../../store/Actions';

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

  const { selectedCity, selectedCategory } = state;
  const { data: cityData } = selectedCity;
  let CategoryComponent = CategoryDatumSimple;

  if (selectedCategory && cityData && cityData.areaDescriptions
    && cityData.areaDescriptions.byNeighborhood) {
    const { form_id: formId } = cityData.areaDescriptions;
    const [cat, subcat] = selectedCategory.split('-');
    CategoryComponent = (components[`Form${formId}`] && components[`Form${formId}`][`Cat${cat}${subcat}`])
      ? components[`Form${formId}`][`Cat${cat}${subcat}`] : CategoryDatumSimple;
  }

  return {
    adId: state.selectedCity.data.id,
    CategoryComponent,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryDatum);
