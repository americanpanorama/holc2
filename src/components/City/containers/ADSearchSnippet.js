import { connect } from 'react-redux';
import ADSearchSnippet from '../presentational/ADSearchSnippet';
import FormQualitative from '../../AreaDescription/presentational/FormQualitative';
import Form19370203 from '../../AreaDescription/Form19370203/presentational/SearchResults';
import Form19371001 from '../../AreaDescription/Form19371001/presentational/SearchResults';
import Form1939 from '../../AreaDescription/Form1939/presentational/SearchResults';
import FormYork from '../../AreaDescription/FormYork/presentational/SearchResults';
import { selectArea, highlightArea, unhighlightArea } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const formComponents = {
    1: FormQualitative,
    19370203: Form19370203,
    19370601: Form19370203,
    19370826: Form19370203,
    19371001: Form19371001,
    1939: Form1939,
    9675: FormYork,
  };

  const { form_id: formId, ad_id: adId } = getSelectedCityData(state);
  let FormComponent;
  let SecondFormComponent;
  // Madison's unique in using two different forms
  if (formId === 6234766) {
    FormComponent = formComponents['19370826'];
    SecondFormComponent = formComponents['19371001'];
  } else {
    FormComponent = formComponents[formId];
  }

  return {
    searchingADsFor: state.searchingADsFor,
    adId,
    formId,
    FormComponent,
    SecondFormComponent,
  };
};

const mapDispatchToProps = {
  selectArea,
  highlightArea,
  unhighlightArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSearchSnippet);
