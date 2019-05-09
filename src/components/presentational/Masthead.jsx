import * as React from 'react';
import PropTypes from 'prop-types';
import Hamburger from '../Buttons/presentational/Hamburger';

export default class Masthead extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: this.props.media !== 'phone' && this.props.media !== 'tablet-portrait',
    };

    this.onMenuToggle = this.onMenuToggle.bind(this);
    this.onSelectText = this.onSelectText.bind(this);
  }

  onMenuToggle() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  onSelectText(e) {
    const { media, selectText } = this .props;
    selectText(e.target.id);
    const menuOpen = (media !== 'phone' && media !== 'tablet-portrait');
    this.setState({
      menuOpen,
    });
  }

  render() {
    const { media, landingPage } = this.props;

    return (
      <header id="masthead">
        <div id="headerBackground" />
        <h1>
          <span className="header-main">
            Mapping Inequality
          </span>
          <span className="header-sub">
            Redlining in New Deal America
          </span>
        </h1>
        {(!landingPage) && (
          <nav>
            {(media === 'phone' || media === 'tablet-portrait') && (
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
                  onClick={this.onSelectText}
                  id="intro"
                >
                  Introduction
                </li>
                <li
                  onClick={this.onSelectText}
                  id="downloads"
                >
                  Downloads & Data
                </li>
                <li
                  onClick={this.onSelectText}
                  id="about"
                >
                  About
                </li>
                <li
                  onClick={this.onSelectText}
                  id="contactUs"
                >
                Contact Us
                </li>
              </ul>
            )}
          </nav>
        )}
      </header>
    );
  }
}

Masthead.propTypes = {
  media: PropTypes.string.isRequired,
  landingPage: PropTypes.bool.isRequired,
  selectText: PropTypes.func,
};

Masthead.defaultProps = {
  selectText: () => false,
};
