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
    this.onSelectCity = this.onSelectCity.bind(this);
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

  onSelectCity(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.selectCity(e);
  }

  render() {
    const { cityDownloads } = this.state;
    const objToday = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const todayString = `${months[objToday.getMonth()]} ${objToday.getDate()}, ${objToday.getFullYear()}`;
    return (
      <div id="downloads">
        <h2>
          Downloads &amp; Data
        </h2>
        <p>If you are citing <cite>Mapping Inequality</cite> or acknowledge the source of any of the following data, we recommend the following format using the <cite>Chicago Manual of Style</cite>.</p>
        <div className='citation'>Robert K. Nelson, LaDale Winling, Richard Marciano, Nathan Connolly, et al., &ldquo;Mapping Inequality,&rdquo; <cite>American Panorama</cite>, ed. Robert K. Nelson and Edward L. Ayers, accessed {todayString}, https://dsl.richmond.edu/panorama/redlining/[YOUR VIEW].</div>
        <p>The URL for <cite>Mapping Inequality</cite> updates to reflect the current map view, which city or neighborhood or area description is selected, any text that is open, etc. You can use those URLs to link to or cite a particular state of the map.</p>
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
          Data for individual cities is available below. The shapefile and GeoJSON spatial data includes transcriptions of the area descriptions of the city if they are available.
        </p>

        <div className="filter">
          <input
            type="text"
            placeholder="filter by city or state name"
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
                    <a
                      href={`http://dsl.richmond.edu/panorama/redlining/#city=${c.slug}`}
                      onClick={this.onSelectCity}
                      id={c.adId}
                    >
                      {c.city}
                    </a>
                  </h3>
                  {(c.city.includes('Antonio')) && (
                    <h5 className="citation">
                      <a
                        href="http://digital.utsa.edu/cdm/singleitem/collection/p16018coll12/id/79"
                        target="_blank"
                      >
                        Scan from HOLC San Antonio City Survey Report 2 Exhibit A: Grades of Security, HOLC Redlining Maps of San Antonio, UTSA Special Collections.
                      </a>
                    </h5>
                  )}
                  {(c.city === 'Harrisburg') && (
                    <h5 className="citation">
                      The data for Harrisburg, Pennsylvania, is based on HOLC records transcribed and digitized in March 2018 by Rachel Williams and Sarah Wilson as part of the 
                      <a 
                        href="https://digitalharrisburg.com/2018/05/14/harrisburg-and-redlining/"
                        target="_blank"
                      >
                        {' Digital Harrisburg Inititiative '}
                      </a>
                      of Messiah College and Harrisburg University of Science and Technology. 
                    </h5>
                  )}
                  <div className='cityDownloads'>
                    <section>
                      <h4>
                        {(c.rasters.length === 1)
                          ? (
                            <a
                              href={c.rasters[0].mapUrl}
                              download
                            >
                              Scan
                            </a>
                          )
                          : 'Scans'
                        }
                      </h4>
                      <ul>
                        {c.rasters.map(r => (
                          <LazyLoad
                            height={276}
                            offsetVertical={300}
                            key={`scanFor${r.id}`}
                          >
                            <li>
                              <a
                                href={r.mapUrl}
                                download
                              >
                                <img src={r.mapUrl.replace('holc-scan', 'holc-scan-thumbnail')} />
                              </a>
                            </li>
                          </LazyLoad>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h4>
                        {(c.geospatial.length === 1)
                          ? (
                            <a
                              href={c.geospatial[0].rectifiedUrl}
                              download
                            >
                              Georectified Image
                            </a>
                          )
                          : 'Georectified Images'
                        }
                      </h4>
                      <ul>
                        {c.geospatial.map(r => (
                          <LazyLoad
                            height={276}
                            offsetVertical={300}
                            key={`georectifiedFor${r.id}`}
                          >
                            <li>
                              <a
                                href={r.rectifiedUrl}
                                download
                              >
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
                    {(c.adsUrl) && (
                      <section>
                        <h4>
                          <a
                            href={c.adsUrl}
                            download
                          >
                            Area Description Images
                          </a>
                        </h4>

                        <ul>
                          <li key={`spatialDataFor${c.adId}`}>
                            <LazyLoad height={276} offsetVertical={300}>
                              <a
                                href={c.adsUrl}
                                download
                              >
                                <img src={c.adsThumbnailUrl} />
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
  selectCity: PropTypes.func.isRequired,
};
