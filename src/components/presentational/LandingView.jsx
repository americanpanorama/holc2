import React from 'react';
import PropTypes from 'prop-types';

const LandingView = ({ isOpen, close }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div id="landingView">
      <h1>
        Mapping Inequality
      </h1>
      <h2>
        Redlining in New Deal America
      </h2>
      <p className="elevatorIntro"><cite>Mapping Inequality</cite> introduces viewers to the records of the Home Owners' Loan Corporation on a scale that is unprecedented. Here you can explore more than 150 interactive maps and thousands of "area descriptions." These materials afford an extraordinary view of the contours of wealth and racial inequality in Depression-era American cities and insights into discriminatory policies and practices that so profoundly shaped cities that we feel their legacy to this day.</p>

      <div onClick={close}>
        close
      </div>
    </div>
  );
};

export default LandingView;

LandingView.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};
