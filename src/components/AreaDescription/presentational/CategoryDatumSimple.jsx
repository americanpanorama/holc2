import React from 'react';
import PropTypes from 'prop-types';
import EmptyField from './EmptyField';

const CategoryDatum = ({ holcId, value }) => (
  <React.Fragment>
    <div className="holcId">
      {holcId}
    </div>
    <div className="value">
      {(value !== null)
        ? value.split('(\\n)').map((item, key) => (
          <p key={key}>
            {item}
          </p>
        ))
        : <EmptyField />}
    </div>
  </React.Fragment>
);

export default CategoryDatum;

CategoryDatum.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.string,
};

CategoryDatum.defaultProps = {
  value: null,
};
