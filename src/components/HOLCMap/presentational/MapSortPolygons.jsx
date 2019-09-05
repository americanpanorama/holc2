import React from 'react';
import PropTypes from 'prop-types';
import { LayerGroup, GeoJSON, Tooltip, CircleMarker } from 'react-leaflet';
import { HEADER_RED_COLOR } from '../../../../data/constants';

const AreaPolygons = ({ overlappingMaps, sortingLatLng, fontSize, bringMapToFront }) => {
  return (
    <React.Fragment>
      <LayerGroup>
        { overlappingMaps.map((p, i) => (
          <GeoJSON
            data={p.the_geojson}
            fillColor={p.fillColor}
            fillOpacity={0.25}
            color={p.fillColor}
            weight={p.weight}
            key={`${p.id}-${p.sortOrder}`}
            id={p.id}
          >
            <Tooltip
              className="neighborhoodLabel"
              direction="center"
              offset={[0, 0]}
              opacity={1}
              permanent
            >
              <span
                style={{
                  fontSize,
                  color: 'black',
                }}
              >
                {overlappingMaps.length - i}
              </span>
            </Tooltip>

            {(i === 0) && (
              <Tooltip
                className="neighborhoodLabel"
                direction="center"
                offset={[0, 0]}
                opacity={1}
                permanent
              >
                <span
                  style={{
                    fontSize,
                    color: 'black',
                  }}
                >
                  {overlappingMaps.length}
                  <br />
                  on bottom
                </span>
              </Tooltip>
            )}

            {(i === overlappingMaps.length - 1) && (
              <Tooltip
                className="neighborhoodLabel"
                direction="center"
                offset={[0, 0]}
                opacity={1}
                permanent
              >
                <span
                  style={{
                    fontSize,
                    color: 'black',
                  }}
                >
                  1
                  <br />
                  on top
                </span>
              </Tooltip>
            )}
          </GeoJSON>
        ))}
      </LayerGroup>

      {(sortingLatLng.length === 2 && overlappingMaps.length > 0) && (
        <CircleMarker
          center={sortingLatLng}
          radius={5}
        >
          <Tooltip
            direction="right"
            offset={[25, 0]}
            opacity={1}
            permanent
            className='sortingList'
          >
            <span
              style={{
                fontSize,
              }}
            >
              <h4>
                Bring to the top
              </h4>
              <ul>
                {overlappingMaps.map(r => (
                  <li
                    className='selectRaster'
                    onClick={bringMapToFront}
                    id={r.id}
                    key={`selectForTop${r.id}`}
                    style={{
                      background: r.fillColor,
                    }}
                  >
                    {r.name}
                    <br />
                    <img
                      src={r.url.replace('{z}/{x}/{y}.png', 'georectified-thumbnail.png')}
                    />
                  </li>
                ))}
              </ul>
            </span>
          </Tooltip>
        </CircleMarker>
      )}
    </React.Fragment>
  );
};

export default AreaPolygons;

AreaPolygons.propTypes = {
  overlappingMaps: PropTypes.arrayOf(PropTypes.object),
  sortingLatLng: PropTypes.array.isRequired,
  bringMapToFront: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
};
