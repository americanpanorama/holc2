import { connect } from 'react-redux';
import USMask from '../presentational/USMask';
import USMaskJSON from '../../../../data/USMask.json';

const mapStateToProps = state => ({
  geojson: (state.map.zoom <= 8) ? USMaskJSON : null,
});

export default connect(mapStateToProps)(USMask);
