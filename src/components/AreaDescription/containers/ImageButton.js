import { connect } from 'react-redux';
import Button from '../presentational/Button';
import { toggleADScan } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { hasADs, hasImages } = state.cities[state.selectedCity];
  return {
    className: (!hasADs || !hasImages) ? 'inactive' : '',
    disabled: !hasADs || !hasImages,
    label: (state.showADScan) ? 'Show Map' : 'Show Scan',
  };
};

const mapDispatchToProps = {
  action: toggleADScan,
};

export default connect(mapStateToProps, mapDispatchToProps)(Button);
