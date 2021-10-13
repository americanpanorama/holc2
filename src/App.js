import { connect } from 'react-redux';
import App from './App.jsx';

const mapStateToProps = (state) => {
  const { initialized, showDataViewerFull, selectedCategory, selectedText, showContactUs, edition } = state;
  return {
    initialized,
    showMap: !(showDataViewerFull && !!selectedCategory) && !selectedText && !showContactUs,
    edition,
  };
};

export default connect(mapStateToProps)(App);
