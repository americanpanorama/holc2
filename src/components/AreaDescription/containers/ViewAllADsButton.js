import { connect } from 'react-redux';
import ViewAllADsButton from '../presentational/Button';
import { selectCategory } from '../../../store/Actions';

const mapStateToProps = () => ({
  label: 'Compare All',
  id: 1,
});

const mapDispatchToProps = {
  action: selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllADsButton);
