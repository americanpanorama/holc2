import PropTypes from 'prop-types';
import { Path, withLeaflet }  from 'react-leaflet';

class AreaPolygon extends Path {

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.leafletElement.clearLayers();
    }
    if (nextProps.className !== this.props.className) {
      this.leafletElement.options.className = nextProps.className;
    }

    if (nextProps.fillOpacity !== this.props.fillOpacity) {
      this.leafletElement.options.fillOpacity = nextProps.fillOpacity;
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.leafletElement.addData(this.props.data);
    }
    this.setStyleIfChanged(prevProps.style, this.props.style);
  }
}

export default withLeaflet(AreaPolygon);

AreaPolygon.propTypes = {
  data: PropTypes.object.isRequired
};
