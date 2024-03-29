import { connect } from 'react-redux';
import Masthead from '../presentational/Masthead';
import { selectText } from '../../store/Actions';

const mapStateToProps = state => ({
  media: state.dimensions.media,
  edition: state.edition,
});

const mapDispatchToProps = {
  selectText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Masthead);
