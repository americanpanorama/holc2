import { connect } from 'react-redux';
import Text from '../presentational/Text';
import { selectText } from '../../../store/Actions';

import About from '../presentational/About';
import ContactUs from '../presentational/ContactUs';
import Introduction from '../presentational/Introduction';


const mapStateToProps = (state) => {
  if (state.selectedText) {
    if (state.selectedText === 'about') {
      return {
        TextComponent: About,
      };
    }
    if (state.selectedText === 'intro') {
      return {
        TextComponent: Introduction,
      };
    }
    if (state.selectedText === 'contactUs') {
      return {
        TextComponent: ContactUs,
      };
    }
  }
  return {};
};

const mapDispatchToProps = {
  selectText,
};

export default connect(mapStateToProps, mapDispatchToProps)(Text);
