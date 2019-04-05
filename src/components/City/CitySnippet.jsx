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
    { (cityData.area && cityData.area.total > 0) && (
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
    { (cityData.population && cityData.population.total) && (
      <div className="populationStats">
        <span className="catName">
          {'Population: '}
        </span>
        <span className="subcatData">
          { cityData.population.total.toLocaleString() }
        </span>
      </div>
    )}
    <ul>
      { cityData.population && cityData.population.percents && cityData.population.percents.map(pop => (
        <li key={`pop${pop.label.replace(/ /g, '')}`}>
          {`${pop.proportion} ${pop.label}`}
        </li>
      ))}
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
