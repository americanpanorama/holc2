import { connect } from 'react-redux';
import SimpleCategory from '../presentational/SimpleCategory';
import { selectCategory } from '../../../store/Actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  selectCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleCategory);
