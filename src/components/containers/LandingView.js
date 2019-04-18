import { connect } from 'react-redux';
import LandingView from '../presentational/LandingView';
import { toggleLandingPage } from '../../store/Actions';

const mapStateToProps = state => ({
  isOpen: state.landingPage,
});

const mapDispatchToProps = {
  close: toggleLandingPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(LandingView);
