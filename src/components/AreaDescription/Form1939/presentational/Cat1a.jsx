import React from 'react';
import PropTypes from 'prop-types';
import EmptyField from '../../presentational/EmptyField';

const Cat1a = ({ holcId, value }) => (
  <React.Fragment>
    <div className="holcId">
      {holcId}
    </div>
    { (value[1] || value[2] || value[3]) && (
      <React.Fragment>
        <span className="catName">
          Increasing&nbsp;
        </span>
        <span className="subcatData">
          {(value[1]) ? value[1] : <EmptyField />}
        </span>
        <span className="catName">
          &nbsp;&nbsp;Decreasing&nbsp;
        </span>
        <span className="subcatData">
          {(value[2]) ? `${value[2]} ` : <EmptyField />}
        </span>
        <span className="catName">
          &nbsp;&nbsp;Static&nbsp;
        </span>
        <span className="subcatData">
          {(value[3]) ? `${value[3]} ` : <EmptyField />}
        </span>
      </React.Fragment>
    )}
  </React.Fragment>
);

export default Cat1a;

Cat1a.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
};
