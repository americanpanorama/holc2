import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, FeatureGroup, Marker, Polyline } from 'react-leaflet';

export default class ClickableCities extends React.Component {
  constructor(props) {
    super(props);

    this.labelRefs = {};
    props.cities.forEach((c) => {
      this.labelRefs[c.ad_id] = React.createRef();
    });
  }

  componentDidUpdate() {
    const { cities } = this.props;
    const intersects = (a, b) => (
      a[0][0] <= b[1][0] && b[0][0] <= a[1][0]
      && a[0][1] <= b[1][1] && b[0][1] <= a[1][1]
    );

    const boundingBoxes = [];

    cities.forEach((c) => {
      let collides = false;

      // get the bounding box for the label
      if (this.labelRefs[c.ad_id] && this.labelRefs[c.ad_id].current) {
        const styles = window.getComputedStyle(this.labelRefs[c.ad_id].current.leafletElement._container);
        if (styles.transform.match(/[0-9., -]+/)) {
          const x1 = parseInt(styles.transform.match(/[0-9., -]+/)[0].split(", ")[4]);
          const y1 = parseInt(styles.transform.match(/[0-9., -]+/)[0].split(", ")[5]);
          const x2 = x1 + parseInt(styles.width);
          const y2 = y1 + parseInt(styles.height);
          const bb = [[x1, y1], [x2, y2]];

          // check for collision
          boundingBoxes.forEach((boundingBox) => {
            if (intersects(boundingBox, bb)) {
              this.labelRefs[c.ad_id].current.leafletElement._container.style.visibility = 'hidden';
              collides = true;
            }
          });

          if (!collides) {
            boundingBoxes.push(bb);
          }
        }
      }
    });
  }

  render() {
    const { cities, onCitySelected } = this.props;
    return (
      <React.Fragment>
        { cities.map(c => (
          <FeatureGroup
            key={`clickableMapitem${c.ad_id}`}
            
          >
            <Polyline
              positions={[[c.centerLat, c.centerLng], [c.offsetPoint[1], c.offsetPoint[0]]]}
              color="#666"
              weight={1}
            />

            <Marker
              position={[c.offsetPoint[1], c.offsetPoint[0]]}
              icon={c.icon}
              id={c.ad_id}
              onClick={onCitySelected}
              className='cityMarker'
            >
              {(false && c.showLabel) && (
                <Tooltip
                  className={`cityLabel class${c.labelClass}`}
                  direction={c.labelDirection}
                  //offset={c.labelOffset}
                  opacity={1}
                  permanent
                  ref={this.labelRefs[c.ad_id]}
                >
                  <span>
                    {c.name}
                  </span>
                </Tooltip>
              )}
            </Marker>
          </FeatureGroup>
        ))}

      {/* JSX Comment
        <Marker
          position={[39.75, -73.15]}
        >
          <Tooltip
            className={`cityLabel class1`}
            direction="right"
            //offset={c.labelOffset}
            opacity={1}
            permanent
          >
            <span>
              Boroughs of New York
            </span>
          </Tooltip>
        </Marker>

        <Marker
          position={[41.75, -70.15]}
        >
          <Tooltip
            className={`cityLabel class1`}
            direction="right"
            //offset={c.labelOffset}
            opacity={1}
            permanent
          >
            <span>
              Greater Boston
            </span>
          </Tooltip>
        </Marker>  */}
      </React.Fragment>
    );
  }
};


ClickableCities.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCitySelected: PropTypes.func.isRequired,
};
