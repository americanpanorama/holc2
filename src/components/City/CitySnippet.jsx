import React from 'react';
import PropTypes from 'prop-types';

const CitySnippet = ({ cityData, displayState, onCityClick }) => (
  <div
    className="city-snippet"
    onClick={onCityClick}
    role="link"
    tabIndex={0}
    id={cityData.ad_id}
  >
    { (cityData.hasADs && cityData.hasImages) && (
      <h4>
        area descriptions data &amp; scans
      </h4>
    )}

    { (!cityData.hasADs && cityData.hasImages) && (
      <h4>
        area descriptions scans
      </h4>
    )}

    { (cityData.hasADs && !cityData.hasImages) && (
      <h4>
        area descriptions data
      </h4>
    )}

    { (cityData.hasPolygons) && (
      <div className="barchart">
        <svg
          width={90}
          height={64}
        >
          <g transform="translate(0 24)">
            <rect
              x={90 * (1 - cityData.area.a / cityData.area.total)}
              y={0}
              width={90 * (cityData.area.a / cityData.area.total)}
              height={6}
              className="grade_a"
            />
            <rect
              x={90 * (1 - cityData.area.b / cityData.area.total)}
              y={10}
              width={90 * (cityData.area.b / cityData.area.total)}
              height={6}
              className="grade_b"
            />
            <rect
              x={90 * (1 - cityData.area.c / cityData.area.total)}
              y={20}
              width={90 * (cityData.area.c / cityData.area.total)}
              height={6}
              className="grade_c"
            />
            <rect
              x={90 * (1 - cityData.area.d / cityData.area.total)}
              y={30}
              width={90 * (cityData.area.d / cityData.area.total)}
              height={6}
              className="grade_d"
            />
          </g>
        </svg>
      </div>
    )}

    <h1>
      {/* href for indexing */}
      <a
        href={`//dsl.richmond.edu/panorama/redlining/#city=${cityData.slug}`}
        onClick={() => false}
        tabIndex={-1}
      >
        { cityData.name + ((displayState) ? `,  ${cityData.state}` : '') }
      </a>
    </h1>
    { (cityData.displayPop && cityData.displayPop[1940].total) && (
      <div className="populationStats">
        <span className="catName">
          Population (1940):
        </span>
        <span className="subcatData">
          { cityData.displayPop[1940].total.toLocaleString() }
        </span>
      </div>
    )}
    <ul>
      { cityData.displayPop && cityData.displayPop[1940].percents.map((pop) => {
        if (Math.round(pop.proportion * 100) !== -1) {
          return (
            <li key={`pop1940${pop.label.replace(/ /g, '')}`}>
              {`${Math.round(pop.proportion * 100)}% ${pop.label}`}
            </li>
          );
        }
        return null;
      })}
    </ul>
  </div>
);

export default CitySnippet;

CitySnippet.propTypes = {
  cityData: PropTypes.shape({
    hasADs: PropTypes.bool,
    hasImages: PropTypes.bool,
    area: PropTypes.object,
  }).isRequired,
  displayState: PropTypes.bool.isRequired,
  onCityClick: PropTypes.func.isRequired,
};
