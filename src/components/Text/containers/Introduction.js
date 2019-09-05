import { connect } from 'react-redux';
import Introduction from '../presentational/Introduction';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(Introduction);
