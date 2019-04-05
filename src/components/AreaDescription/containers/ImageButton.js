import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { toggleADScan } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { hasImages } = getSelectedCityData(state);
  return {
    className: !hasImages ? 'inactive' : '',
    disabled: !hasImages,
    label: (state.showADScan) ? 'Show Map' : 'Show Scan',
  };
};

const mapDispatchToProps = {
  action: toggleADScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
