import React from 'react';
import PropTypes from 'prop-types';

import CategoryDatum from '../containers/CategoryDatum';
import CloseButton from '../../Buttons/presentational/Close';
import FullScreenButton from '../../Buttons/presentational/FullScreen';

const Category = ({ title, values, unselectCategory, toggleDataViewerFull }) => (
  <div id="adCategory">
    <h3>
      {title}

      <span
        onClick={toggleDataViewerFull}
        role="button"
        tabIndex={0}
        style={{
          marginLeft: 5,
        }}
      >
        <FullScreenButton />
      </span>
      <span
        onClick={unselectCategory}
        role="button"
        tabIndex={0}
        style={{
          marginLeft: 5,
        }}
      >
        <CloseButton />
      </span>
    </h3>

    <div className="grade A">
      <h4>
        A
      </h4>
      <ul>
        {values.A.map(d => (
          <CategoryDatum
            holcId={d.holcId}
            value={d.value}
            key={`adValueFor${d.holcId}`}
          />
        ))}
      </ul>
    </div>

    <div className="grade B">
      <h4>
        B
      </h4>
      <ul>
        {values.B.map(d => (
          <CategoryDatum
            holcId={d.holcId}
            value={d.value}
            key={`adValueFor${d.holcId}`}
          />
        ))}
      </ul>
    </div>

    <div className="grade C">
      <h4>
        C
      </h4>
      <ul>
        {values.C.map(d => (
          <CategoryDatum
            holcId={d.holcId}
            value={d.value}
            key={`adValueFor${d.holcId}`}
          />
        ))}
      </ul>
    </div>

    <div className="grade D">
      <h4>
        D
      </h4>
      <ul>
        {values.D.map(d => (
          <CategoryDatum
            holcId={d.holcId}
            value={d.value}
            key={`adValueFor${d.holcId}`}
          />
        ))}
      </ul>
    </div>
  </div>
);

export default Category;

Category.propTypes = {
  title: PropTypes.string,
  values: PropTypes.shape({
    A: PropTypes.arrayOf(PropTypes.object),
    B: PropTypes.arrayOf(PropTypes.object),
    C: PropTypes.arrayOf(PropTypes.object),
    D: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  unselectCategory: PropTypes.func.isRequired,
  toggleDataViewerFull: PropTypes.func.isRequired,
};

Category.defaultProps = {
  title: null,
};
