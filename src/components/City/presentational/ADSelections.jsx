import React from 'react';
import PropTypes from 'prop-types';
import ADSearch from '../containers/ADSearch';

const ADSelections = ({ selections, adId, isSearchingADs, selectArea, highlightArea, unhighlightArea }) => (
  <section className="adSelections">
    <h3>
      Area Descriptions
    </h3>

    <ADSearch />

    {(selections && !isSearchingADs) && (
      <div>
        <h4>
          Selections from the Area Descriptions
        </h4>
        {selections.map(selection => (
          <div
            className={`adSelection grade${selection.grade}`}
            key={`selectionFor${selection.holcId}`}
            onClick={selectArea}
            onMouseEnter={highlightArea}
            onMouseLeave={unhighlightArea}
            id={`${adId}-${selection.holcId}`}
          >
            <h4>
              {`${selection.holcId} ${(selection.name) ? ` ${selection.name} ` : ''}`}
            </h4>
            <div className="selectionText">
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
  isSearchingADs: PropTypes.bool.isRequired,
  selectArea: PropTypes.func.isRequired,
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
};

ADSelections.defaultProps = {
  selections: undefined,
};
