import React from 'react';
import PropTypes from 'prop-types';
import Button from '../AreaDescription/presentational/Button';

class LandingView extends React.Component {

  constructor(props) {
    super(props);
  
    this.dontShowAgain = React.createRef();

    this.handleEnter = this.handleEnter.bind(this);
  }

  handleEnter(event) {
    this.props.close(this.dontShowAgain.current.checked);
    event.preventDefault();
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <div id="landingView">
        <div className="landingImg">
          <img src="./static/durhamMosaic.png" />
        </div>
        <header>
          <div className="container">
            <h1>
              <span className="header-main">
                Mapping Inequality
              </span>
              <span className="header-sub">
                Redlining in New Deal America
              </span>
            </h1>

            <p className="elevatorIntro">Here you can explore more than 200 interactive redlining maps created by the Home Owners' Loan Corporation in the 1930s. These maps and the materials used to create them offer an extraordinary view of  discriminatory real estate practices that contributed to inequalities of wealth and race so profoundly that we feel their legacy to this day.</p>

            <form onSubmit={this.handleEnter}>
              <Button
                label="start exploring"
                className="enter"
                type="submit"
              />
              <div>
                <input
                  type="checkbox"
                  id="dontShowAgain"
                  ref={this.dontShowAgain}
                  value='dontShowAgain'
                />
                <label
                  htmlFor="dontShowAgain"
                >
                  do not show again
                </label>
              </div>
            </form>
          </div>
        </header>
        <div className="howTos">
          <div className="container">
            <h3>
              Using the Map
            </h3>
            <section>
              <figure>
                <img
                  src="//s3.amazonaws.com/holc/tiles/NC/Durham/1937/holc-scan-thumbnail.jpg"
                />
                <figcaption>
                  
                </figcaption>
              </figure>
            </section>
            <section>
              <figure>
                <img
                  src="./static/landingAreasSelected.svg"
                />
                <figcaption>
                  Click on an any area to read its area description.
                </figcaption>
              </figure>
            </section>
            <section>
              <figure>
                <img
                  src="./static/landingCategory.svg"
                />
                <figcaption>
                  Select area description categories or search the area descriptions to compare across the city.
                </figcaption>
              </figure>
            </section>
          </div>
        </div>

      </div>
    );
  };
}

export default LandingView;

LandingView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
