import React from 'react';
import PropTypes from 'prop-types';
import NeighborhoodMap from '../containers/NeighborhoodMap';

const CategoryDatum = (props) => {
  const {
    holcId,
    value,
    adId,
    selectArea,
    highlightArea,
    unhighlightArea,
    showMapFor,
    CategoryComponent,
  } = props;

  return (
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
      {(showMapFor && holcId === showMapFor.holcId && adId === showMapFor.adId) && (
        <NeighborhoodMap
          holcId={holcId}
          adId={adId}
        />
      )}
    </li>
  );
};

export default CategoryDatum;

CategoryDatum.propTypes = {
  holcId: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  adId: PropTypes.number.isRequired,
  selectArea: PropTypes.func.isRequired,
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
  CategoryComponent: PropTypes.func.isRequired,
  showMapFor: PropTypes.shape({
    holcId: PropTypes.string,
    adId: PropTypes.number,
  }),
};

CategoryDatum.defaultProps = {
  value: null,
  showMapFor: undefined,
};
