import { connect } from 'react-redux';
import App from './App.jsx';

const mapStateToProps = (state) => {
  const { initialized, showDataViewerFull, selectedCategory, selectedText, showContactUs } = state;
  return {
    initialized,
    showMap: !(showDataViewerFull && !!selectedCategory) && !selectedText && !showContactUs,
  };
};

export default connect(mapStateToProps)(App);
