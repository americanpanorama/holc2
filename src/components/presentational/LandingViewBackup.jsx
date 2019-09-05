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

            <p className="elevatorIntro"><cite>Mapping Inequality</cite> introduces viewers to the records of the Home Owners' Loan Corporation on a scale that is unprecedented. Here you can explore more than 200 interactive maps and thousands of "area descriptions."  These materials afford an extraordinary view of the contours of wealth and racial inequality in Depression-era American cities and offer insights into discriminatory policies and practices that had such a profound impact that we feel their legacy to this day.</p>

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
