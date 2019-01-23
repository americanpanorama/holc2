import React from 'react';
import PropTypes from 'prop-types';
import SidebarNeighborhoodNav from './SidebarNeighborhoodNav.jsx';
import SidebarNeighborhoodTitle from './SidebarNeighborhoodTitle.jsx';
import HOLCMap from './HOLCMap/presentational/HOLCMap.jsx';

export default class SidebarMap extends React.Component {

  constructor () {
    super();
  }

  shouldComponentUpdate (nextProps) {
    return true;
  }

  render () {

    return (
      <div className='areaDescription'>

        <SidebarNeighborhoodTitle
          areaId={ this.props.areaId }
          name={ this.props.neighborhoodNames[this.props.areaId] }
          onClose={ this.props.onClose }
        />

        { (this.props.previousAreaId) ?
          <SidebarNeighborhoodNav
            style={ this.props.previousStyle }
            onHOLCIDClick={ this.props.onHOLCIDClick } 
            areaId ={ this.props.previousAreaId } 
            name={ this.props.neighborhoodNames[this.props.previousAreaId] }
          /> :
          ''
        }

        { (this.props.nextAreaId && this.props.nextAreaId !== 'null') ?
          <SidebarNeighborhoodNav
            style={ this.props.nextStyle }
            onHOLCIDClick={ this.props.onHOLCIDClick } 
            areaId ={ this.props.nextAreaId } 
            name={ this.props.neighborhoodNames[this.props.nextAreaId] }
          /> :
          ''
        }

        <div style={ this.props.mapStyle }>
          <HOLCMap
            ref='holc_map'
            state={ this.props.state }
            selectedCity = { this.props.selectedCity }
            onMapMoved={ this.props.onMapMoved }
            onNeighborhoodPolygonClick={ this.props.onNeighborhoodPolygonClick }
            onCityMarkerSelected= { this.props.onCityMarkerSelected }
            onSliderChange={ this.props.onSliderChange }
            style={ this.props.mapStyle }
          />
        </div>
      </div>
    );
  }

}
