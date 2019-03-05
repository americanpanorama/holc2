import { connect } from 'react-redux';
import ADSearchSnippet from '../presentational/ADSearchSnippet';
import Form19370203 from '../../AreaDescription/Form19370203/presentational/SearchResults';
import Form19371001 from '../../AreaDescription/Form19371001/presentational/SearchResults';
import Form1939 from '../../AreaDescription/Form1939/presentational/SearchResults';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const formComponents = {
    //1: FormQualitative,
    19370203: Form19370203,
    19370601: Form19370203,
    19370826: Form19370203,
    19371001: Form19371001,
    1939: Form1939,
  };

  const { form_id: formId } = state.selectedCity.data.areaDescriptions;

  return {
    searchingADsFor: state.searchingADsFor,
    adId: state.selectedCity.data.id,
    FormComponent: formComponents[formId],
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSearchSnippet);
