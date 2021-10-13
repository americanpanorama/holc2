import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../Buttons/presentational/Hamburger';

const Masthead = ({ media, edition, selectText }) => {
  const [mediaWas, setMediaWas] = useState(media);
  const [isMenuOpen, setIsMenuOpen] = useState(media !== 'phone' && media !== 'tablet-portrait');

  if (media !== mediaWas) {
    setIsMenuOpen(media !== 'phone' && media !== 'tablet-portrait');
    setMediaWas(media);
  }

  const onSelectText = (e) => {
    e.preventDefault();
    e.stopPropagation();
    selectText(e.target.id);
    const menuOpen = (media !== 'phone' && media !== 'tablet-portrait');
    setIsMenuOpen(menuOpen);
  };

  return (
    <header
      id="masthead" 
      className={(edition) ? `edition ${edition}` : ''}
    >
      <div id="headerBackground" />
      <h1>
        {(!edition || edition !== 'placesAndSpaces') ? (
          <a href='//dsl.richmond.edu/panorama/redlining/'>
            <span className="header-main">
              Mapping Inequality
            </span>
            <span className="header-sub">
              Redlining in New Deal America
            </span>
          </a>
        ) : (
          <React.Fragment>
            <span className="header-main">
              Mapping Inequality
            </span>
            <span className="header-sub">
              Places and Spaces Edition
            </span>
          </React.Fragment>
        )}
      </h1>
      <nav>
        {(media === 'phone' || media === 'tablet-portrait') && (
          <div
            className="menuToggle"
            onClick={() => { setIsMenuOpen(!isMenuOpen); }}
            role="button"
          >
            <Hamburger />
          </div>
        )}
        {(isMenuOpen) && (
          <ul>
            <li>
              <a
                href="http://dsl.richmond.edu/panorama/redlining/#text=intro"
                onClick={onSelectText}
                id="intro"
              >
                Introduction
              </a>
            </li>
            <li>
              <a
                href="http://dsl.richmond.edu/panorama/redlining/#text=downloads"
                onClick={onSelectText}
                id="downloads"
              >
                Downloads & Data
              </a>
            </li>
            <li>
              <a
                href="http://dsl.richmond.edu/panorama/redlining/#text=about"
                onClick={onSelectText}
                id="about"
              >
                About
              </a>
            </li>
            <li
              onClick={onSelectText}
              id="contactUs"
            >
            Contact Us
            </li>
            <li
              id="americanPanorama"
            >
              <a
                href="http://dsl.richmond.edu/panorama#maps"
              >
                American Panorama
              </a>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Masthead;

Masthead.propTypes = {
  media: PropTypes.string.isRequired,
  selectText: PropTypes.func,
};

Masthead.defaultProps = {
  selectText: () => false,
};
