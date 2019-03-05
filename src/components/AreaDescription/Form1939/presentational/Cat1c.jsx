import React from 'react';
import PropTypes from 'prop-types';
import EmptyField from '../../presentational/EmptyField';

const Cat1c = ({ holcId, value }) => (
  <React.Fragment>
    <div className="holcId">
      {holcId}
    </div>
    { (value[1] || value[2]) && (
      <React.Fragment>
        <span className="subcatData">
          {(value[1]) ? value[1] : <EmptyField />}
        </span>
        <span className="catName">
          &nbsp;Nationalities&nbsp;
        </span>
        <span className="subcatData">
          {(value[2]) ? `${value[2]} ` : <EmptyField />}
        </span>
      </React.Fragment>
    )}
  </React.Fragment>
);

export default Cat1c;

Cat1c.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
};
