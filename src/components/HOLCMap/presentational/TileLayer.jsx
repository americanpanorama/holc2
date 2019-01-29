import { TileLayer, withLeaflet } from 'react-leaflet';

class UpdateableTileLayer extends TileLayer {
  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);

    if (toProps.className !== fromProps.className) {
      this.leafletElement.className = toProps.className;
    }
  }
}

export default withLeaflet(UpdateableTileLayer)(UpdateableTileLayer);
