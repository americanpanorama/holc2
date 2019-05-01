import React from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazy-load';

class Downloads extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      cityDownloads: props.cityDownloads,
      allCityDownloads: props.cityDownloads,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    const { allCityDownloads } = this.state;
    let cityDownloads = JSON.parse(JSON.stringify(allCityDownloads));

    if (!value) {
      this.setState({
        cityDownloads: allCityDownloads,
      });
    } else {
      // split the value into multiple strings
      const searchTerms = value.toLowerCase().trim().split(' ');
      cityDownloads.forEach((stateData, i) => {
        cityDownloads[i].cities = stateData.cities
          .filter(c => searchTerms.every(st => `${stateData.state} ${c.city}`.toLowerCase().includes(st)));
      });
      cityDownloads = cityDownloads.filter(stateData => stateData.cities.length > 0);
      this.setState({
        cityDownloads,
      });
    }
  }

  render() {
    const { cityDownloads } = this.state;
    return (
      <div id="downloads">
        <h2>
          Downloads
        </h2>
        <p>
          All of the scans of the HOLC maps are in public domain, with the vast majority coming from the National Archives. All of <cite>Mapping Inequality's</cite> spatial, textual, and other data are licensed under a
        </p>

        <div className='license'>
          <a
            rel='license'
            href='http://creativecommons.org/licenses/by-nc-sa/4.0/'
          >
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
            <br />
            <img alt='Creative Commons License' src='https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png' />
          </a>
        </div>

        <p>
          The collective spatial data, including area descriptions transcriptions, is available in two formats:
        </p>

        <div className="fullDownloads">
          <a
            href="#"
            download
          >
            {' Shapefile '}
          </a>
          <a
            href="#"
            download
          >
            {' GeoJSON'}
          </a>
        </div>


        <p>
          Data for individual cities is available below.
        </p>

        <div className="filter">
          <input
            type="text"
            placeholder="filter by state or city name"
            onChange={this.handleChange}
          />
        </div>

        {cityDownloads.map(stateData => (
          <div
            key={`downloadsFor${stateData.state}`}
            className='stateDownloads'
          >
            <h2 className="stateName">
              {stateData.state}
            </h2>
            <ul>
              {stateData.cities.map(c => (
                <li
                  key={`downloadsFor${c.adId}`}
                >
                  <h3>
                    {c.city}
                  </h3>
                  <div className='cityDownloads'>
                    <section>
                      <h4>
                        {(c.rasters.length > 1) ? 'Scans' : 'Scan'}
                      </h4>
                      <ul>
                        {c.rasters.map(r => (
                          <LazyLoad height={276} offsetVertical={300}>
                            <li key={`scanFor${r.id}`}>
                              <a href={r.mapUrl}>
                                <img src={r.mapUrl.replace('holc-scan', 'holc-scan-thumbnail')} />
                              </a>
                            </li>
                          </LazyLoad>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>
                        {(c.geospatial.length > 1) ? 'Georectified Images' : 'Georectified Image'}
                      </h4>
                      <ul>
                        {c.geospatial.map(r => (
                          <LazyLoad height={276} offsetVertical={300}>
                            <li key={`georectifiedFor${r.id}`}>
                              <a href={r.rectifiedUrl}>
                                <img src={r.rectifiedUrl.replace('rectified.zip', 'georectified-thumbnail.png')} />
                              </a>
                            </li>
                          </LazyLoad>
                        ))}
                      </ul>
                    </section>
                    {(c.polygons) && (
                      <section>
                        <h4>
                          <a
                            href={c.polygons.shapefile}
                            download
                          >
                            Shapefile
                          </a>
                          {' or '}
                          <a
                            href={c.polygons.geojson}
                            download
                          >
                            GeoJSON
                          </a>
                        </h4>

                        <ul>
                          <li key={`spatialDataFor${c.adId}`}>
                            <LazyLoad height={276} offsetVertical={300}>
                              <a
                                href={c.polygons.geojson}
                                download
                              >
                                <img src={c.polygons.imgUrl} />
                              </a>
                            </LazyLoad>
                          </li>
                        </ul>
                      </section>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
}

export default Downloads;

Downloads.propTypes = {
  cityDownloads: PropTypes.arrayOf(PropTypes.shape({
    state: PropTypes.string,
    cities: PropTypes.array,
  })).isRequired,
};
