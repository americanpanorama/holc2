import { connect } from 'react-redux';
import App from './App.jsx';


const mapStateToProps = state => ({
  initialized: state.initialized,
});

export default connect(mapStateToProps)(App);
