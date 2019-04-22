import * as React from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../Buttons/presentational/Hamburger';

export default class Masthead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: this.props.media !== 'phone',
    };

    this.onMenuToggle = this.onMenuToggle.bind(this);
  }

  onMenuToggle() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  render() {
    const { media, selectText } = this.props;

    return (
      <header id="masthead">
        <h1>
          <span className="header-main">
            Mapping Inequality
          </span>
          <span className="header-sub">
            Redlining in New Deal America
          </span>
        </h1>
        <nav>
          {(media === 'phone') && (
            <div
              className="menuToggle"
              onClick={this.onMenuToggle}
            >
              <Hamburger />
            </div>
          )}
          {(this.state.menuOpen) && (
            <ul>
              <li
                onClick={selectText}
                id="intro"
              >
                Introduction
              </li>
              <li
                onClick={selectText}
                id="downloads"
              >
                Downloads & Data
              </li>
              <li
                onClick={selectText}
                id="about"
              >
                About
              </li>
              <li
                onClick={selectText}
                id="contactUs"
              >
              Contact Us
              </li>
            </ul>
          )}
        </nav>
      </header>
    );
  }
}

Masthead.propTypes = {
  media: PropTypes.string.isRequired,
  selectText: PropTypes.func,
};

Masthead.defaultProps = {
  selectText: () => false,
};
