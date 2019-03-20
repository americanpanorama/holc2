import { connect } from 'react-redux';
import Category from '../presentational/Category';
import { unselectCategory, toggleDataViewerFull } from '../../../store/Actions';
import FormsMetadata from '../../../../data/formsMetadata.json';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const values = { A: [], B: [], C: [], D: [] };
  let title;
  const { selectedCategory, areaDescriptions } = state;
  const cityData = getSelectedCityData(state);

  if (selectedCategory && cityData && areaDescriptions) {
    const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
    const { form_id: formId } = cityData;
    Object.keys(areaDescriptions)
      .sort(collator.compare)
      .forEach((holcId) => {
        const { holc_grade: holcGrade, areaDesc } = state.areaDescriptions[holcId];
        const [cat, subcat] = selectedCategory.split('-');

        if (areaDesc && ['A', 'B', 'C', 'D'].includes(holcGrade)) {
          if (!subcat) {
            values[holcGrade].push({
              holcId,
              value: areaDesc[cat],
            });
            title = `${cat} ${FormsMetadata[formId][cat]}`;
          } else {
            values[holcGrade].push({
              holcId,
              value: areaDesc[cat][subcat],
            });
            title = `${cat}${subcat} ${FormsMetadata[formId][cat].header} ${FormsMetadata[formId][cat].subcats[subcat]}`;
          }
        }
      });
  }

  return {
    values,
    title,
  };
};

const mapDispatchToProps = {
  unselectCategory,
  toggleDataViewerFull,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
