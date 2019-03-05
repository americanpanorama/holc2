import React from 'react';
import PropTypes from 'prop-types';
import EmptyField from './EmptyField';

const CategoryDatum = ({ holcId, value, adId, selectArea, CategoryComponent }) => (
  <li
    onClick={selectArea}
    id={`${adId}-${holcId}`}
  >
    <CategoryComponent
      holcId={holcId}
      value={value}
    />
  </li>
);

export default CategoryDatum;

CategoryDatum.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  adId: PropTypes.number.isRequired,
  selectArea: PropTypes.func.isRequired,
  CategoryComponent: PropTypes.func.isRequired,
};

CategoryDatum.defaultProps = {
  value: null,
};
