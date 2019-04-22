import React from 'react';
import PropTypes from 'prop-types';
import Button from '../AreaDescription/presentational/Button';

const LandingView = ({ isOpen, close }) => {
  if (!isOpen) {
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

          <p className="elevatorIntro"><cite>Mapping Inequality</cite> introduces viewers to the records of the Home Owners' Loan Corporation on a scale that is unprecedented. Here you can explore more than 150 interactive maps and thousands of "area descriptions."  These materials afford an extraordinary view of the contours of wealth and racial inequality in Depression-era American cities and insights into discriminatory policies and practices that so profoundly shaped cities that we feel their legacy to this day.</p>

          <Button
            label="enter"
            action={close}
            className="enter"
          />
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
                src="./static/landingAreas.svg"
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

export default LandingView;

LandingView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
