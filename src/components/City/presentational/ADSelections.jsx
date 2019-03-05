import React from 'react';
import PropTypes from 'prop-types';
import ADSearch from '../containers/ADSearch';

const ADSelections = ({ selections, adId, selectArea }) => (
  <section className="adSelections">
    <h3>
      Area Descriptions
    </h3>

    <ADSearch />

    {(selections) && (
      <div>
        <h4>
          Selections from the Area Descriptions
        </h4>
        {selections.map(selection => (
          <div
            className={`adSelection grade${selection.grade}`}
            key={`selectionFor${selection.holcId}`}
            onClick={selectArea}
            id={`${adId}-${selection.holcId}`}
          >
            <h4>
              {`${selection.holcId} ${(selection.name) ? ` ${selection.name} ` : ''}`}
            </h4>
            <div>
              {selection.selection}
              {(selection.catName) && (
                <span className="catName">
                  {` (${selection.catName})`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default ADSelections;

ADSelections.propTypes = {
  selections: PropTypes.arrayOf(PropTypes.object),
  adId: PropTypes.number.isRequired,
  selectArea: PropTypes.func.isRequired,
};

ADSelections.defaultProps = {
  selections: undefined,
};
