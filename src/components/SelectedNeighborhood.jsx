import React from 'react';
import PropTypes from 'prop-types';
import AreaDescription from './AreaDescription.jsx';
import ADImage from './ADImage.jsx';

export default class SelectedNeighborhood extends React.Component {
  constructor () {
    super();
  }

  render () {
    let transcriptionButtonLabel;
    if (this.props.adImageOpen) {
      transcriptionButtonLabel = 'show transcription';
    } else if (!this.props.hasADData) {
      transcriptionButtonLabel = 'not transcribed yet';
    } else {
      transcriptionButtonLabel  = 'show image';
    }
    return (
      <div className='areaDescription sidebar' style={this.props.style}>
        <header style={this.props.headerStyle}>
          <h2 className='sidebarTitle'>
            {`${this.props.city}, ${this.props.state}`}
            <span className='closeicon' onClick={ this.props.onClose }>
                    <svg
                      width={20 + 2}
                      height={20 + 2}
                    >
                      <g transform={`translate(${20 / 2 + 1} ${20 / 2 + 1}) rotate(135)`}>
                        <circle
                          cx={0}
                          cy={0}
                          r={20 / 2}
                          fill='#4B4E6D'
                          strokeWidth={0}
                        />
                        <line
                          x1={0}
                          x2={0}
                          y1={20 / 4}
                          y2={20 / -4}
                          stroke='#ddd'
                          strokeWidth={20 / 10}
                        />
                        <line
                          x1={20 / -4}
                          x2={20 / 4}
                          y1={0}
                          y2={0}
                          stroke='#ddd'
                          strokeWidth={20 / 10}
                        />
                      </g>
                    </svg>

            </span>
          </h2>
          <h2 className='sidebarTitle'>
            { (this.props.previousAreaId) &&
              <span
                onClick={this.props.onHOLCIDClick}
                id={this.props.previousAreaId} 
                style={{
                  float: 'left',
                  marginLeft: 20
                }}
              >
                  <svg
                    width={20}
                    height={20}
                  >
                    <g transform={`translate(${20 / 2} ${20 / 2}) rotate(315)`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={20 / 2}
                        fill='#4B4E6D'
                        fillOpacity={1}
                      />
                      <path
                        d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
                        fill='transparent'
                        stroke='#ddd'
                        strokeWidth={20 / 10}
                      />
                    </g>
                  </svg>
              </span>
            }
            <a
              href={'//dsl.richmond.edu/panorama/redlining/#city=' + this.props.citySlug + '&area=' + this.props.areaId }
              onClick={ event => event.preventDefault() }
            >
              { (this.props.neighborhoodNames[this.props.areaId]) ?
                this.props.areaId + ' ' + this.props.neighborhoodNames[this.props.areaId] :
                this.props.areaId
              }
            </a>
            { (this.props.nextAreaId) &&
              <span
                onClick={this.props.onHOLCIDClick}
                id={this.props.nextAreaId} 
                style={{
                  float: 'right',
                  marginRight: 20
                }}
              >
                  <svg
                    width={20}
                    height={20}
                  >
                    <g transform={`translate(${20 / 2} ${20 / 2}) rotate(135)`}>
                      <circle
                        cx={0}
                        cy={0}
                        r={20 / 2}
                        fill='#4B4E6D'
                        fillOpacity={1}
                      />
                      <path
                        d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
                        fill='transparent'
                        stroke='#ddd'
                        strokeWidth={20 / 10}
                      />
                    </g>
                  </svg>
              </span>
            }
                      </h2> 

          <div
            style={{
              textAlign: 'center'
            }}
          >
            <button 
              onClick={this.props.onAdImageClicked}
              className={(!this.props.hasADData) ? 'inactive' : ''}
              disabled={(!this.props.hasADData) ? true : false}
              style={{
                marginRight: 10
              }}
            >
              {transcriptionButtonLabel}
            </button>

            <button 
              onClick={ this.props.onToggleADView }
              className={(!this.props.hasADData || this.props.adImageOpen || this.props.formId === 1) ? 'inactive' : ''}
              disabled={(!this.props.hasADData || this.props.adImageOpen || this.props.formId === 1) ? true : false}
              style={{
                marginLeft: 10
              }}
            >
              {(this.props.show == 'full') ? 'show curated selection' : 'show full area description'}
            </button>
          </div>

        </header>

        { (this.props.adImageOpen || !this.props.hasADData) ? 
          <ADImage {...this.props} /> : 
          <AreaDescription {...this.props} />
        }
        
      </div>
    );
  }
}
