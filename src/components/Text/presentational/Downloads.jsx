import React from 'react';
import PropTypes from 'prop-types';

const Downloads = ({ cityDownloads }) => {
  console.log(cityDownloads);
  return (
    <React.Fragment>
      <h2>
        Downloads
      </h2>
      <div>
        <a rel='license' href='http://creativecommons.org/licenses/by-nc-sa/4.0/'>
          <img alt='Creative Commons License' src='https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png' />
        </a>
        <br />
        <p>
          This work and its data are licensed under a
          <a rel='license' href='http://creativecommons.org/licenses/by-nc-sa/4.0/'>
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
          </a>
          .
        </p>
      </div>

      <div>
        Shape file of all spatial and area description data.
      </div>

      {cityDownloads.map(stateData => (
        <div
          key={`downloadsFor${stateData.state}`}
        >
          <h2>
            {stateData.state}
          </h2>
          <ul>
            {stateData.cities.map(c => (
              <li>
                <h3>
                  {c.city}
                </h3>
                <h4>
                  Maps
                </h4>
                <ul>
                  {c.rasters.map(r => (
                    <li>
                      <h5>
                        {r.name}
                      </h5>
                      <a href={r.mapUrl}>
                        Original Scan
                      </a>
                      <a href={r.rectifiedUrl}>
                        Georectified Map
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}



    </React.Fragment>
  );
}

export default Downloads;

Downloads.propTypes = {
  cityDownloads: PropTypes.arrayOf(PropTypes.shape({
    state: PropTypes.string,
    cities: PropTypes.array,
  })).isRequired,
};
