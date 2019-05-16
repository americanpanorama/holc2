import React from 'react';
import PropTypes from 'prop-types';

const CategoryDatum = ({ holcId, value, adId, selectArea, highlightArea, unhighlightArea, CategoryComponent }) => (
  <li
    onClick={selectArea}
    onMouseEnter={highlightArea}
    onMouseLeave={unhighlightArea}
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
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
  CategoryComponent: PropTypes.func.isRequired,
};

CategoryDatum.defaultProps = {
  value: null,
};
