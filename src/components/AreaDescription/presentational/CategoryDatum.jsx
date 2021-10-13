import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import HoverIntet from 'react-hoverintent';
import NeighborhoodMap from '../containers/NeighborhoodMap';

const CategoryDatum = (props) => {
  const theElement = useRef(null);
  const [elementY, setElementY] = useState(0);
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

  const onMouseOver = (eOrId) => {
    const { offsetTop } = (theElement.current.element);
    const { scrollTop } = (theElement.current.element.offsetParent);
    setElementY(offsetTop - scrollTop);
    highlightArea(eOrId);
  };

  return (
    <HoverIntet
      onMouseOver={onMouseOver}
      onMouseOut={unhighlightArea}
      ref={theElement}
    >
      <li
        onClick={selectArea}
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
            y={elementY}
          />
        )}
      </li>
    </HoverIntet>
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
