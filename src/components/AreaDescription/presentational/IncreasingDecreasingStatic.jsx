import React from 'react';
import PropTypes from 'prop-types';
import EmptyField from './EmptyField';

const CategoryDatum193710015c = ({ holcId, value }) => (
  <React.Fragment>
    <div className="holcId">
      {holcId}
    </div>
    { (value[1] || value[2]) && (
      <React.Fragment>
        <span className="subcatName">
          {'increasing '}
        </span>
        <span className="subcatData">
          { (value[1]) ? value[1] : <EmptyField /> }
        </span>
        <span className="subcatName">
          {'; decreasing '}
        </span>
        <span className="subcatData">
          { (value[2]) ? value[2] : <EmptyField /> }
        </span>
        <span className="subcatName">
          ; static
        </span>
      </React.Fragment>
    )}
  </React.Fragment>
);

export default CategoryDatum193710015c;

CategoryDatum193710015c.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
};
