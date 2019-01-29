import { connect } from 'react-redux';
import Masthead from '../presentational/Masthead';
//import {  } from '../../../store/Actions';

const mapStateToProps = state => ({
  style: state.dimensions.headerStyle,
});

// const mapDispatchToProps = {
//   ,
// };

export default connect(mapStateToProps)(Masthead);
