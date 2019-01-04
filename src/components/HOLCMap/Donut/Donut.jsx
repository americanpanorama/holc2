import React from 'react';
import PropTypes from 'prop-types';
import { Path, PropTypes as LeafletPropTypes } from 'react-leaflet';
import donut from './L.Donut.js';


export default class Donut extends Path {
  // Radii are in meters
  // static propTypes = {
  //  center: LeafletPropTypes.latlng.isRequired,
  //  outerRadius: PropTypes.number.isRequired,
  //  innerRadius: PropTypes.number.isRequired,
  // };

  constructor() {
    super();
  }

  createLeafletElement(props) {
    //const {center, outerRadius, innerRadius, ...theProps} = props;
    const {center, outerRadius, innerRadius, ...theProps} = props;
    //super.componentWillMount();
    //super.createLeafletElement(this.props);
    this.leafletElement = new donut(center, outerRadius, innerRadius, theProps);
  }

  updateLeafletElement(prevProps, newProps) {
    if (newProps.center !== prevProps.center) {
      this.leafletElement.setLatLng(newProps.center);
    }

    if (newProps.outerRadius !== prevProps.outerRadius || newProps.innerRadius !== prevProps.innerRadius) {
      this.leafletElement.setRadius(newProps.outerRadius, newProps.innerRadius);
    }

    this.setStyleIfChanged(prevProps, newProps);
  }
}
