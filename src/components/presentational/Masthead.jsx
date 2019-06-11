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
    e.preventDefault();
    e.stopPropagation();
    selectText(e.target.id);
    const menuOpen = (media !== 'phone' && media !== 'tablet-portrait');
    this.setState({
      menuOpen,
    });
  }

  render() {
    const { media, landingPage } = this.props;
    const { menuOpen } = this.state;

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
            {(menuOpen) && (
              <ul>
                <li>
                  <a
                    href="http://dsl.richmond.edu/panorama/redlining/#text=intro"
                    onClick={this.onSelectText}
                    id="intro"
                  >
                    Introduction
                  </a>
                </li>
                <li>
                  <a
                    href="http://dsl.richmond.edu/panorama/redlining/#text=downloads"
                    onClick={this.onSelectText}
                    id="downloads"
                  >
                    Downloads & Data
                  </a>
                </li>
                <li>
                  <a
                    href="http://dsl.richmond.edu/panorama/redlining/#text=about"
                    onClick={this.onSelectText}
                    id="about"
                  >
                    About
                  </a>
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
