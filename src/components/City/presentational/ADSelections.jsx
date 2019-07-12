import React from 'react';
import PropTypes from 'prop-types';
import ADSearch from '../containers/ADSearch';

const ADSelections = ({ selections, adId, isSearchingADs, selectArea, highlightArea, unhighlightArea }) => {
  if (!selections) {
    return (
      <section className="adSelections">
        <h4 className="tip">
          Area Descriptions for this city have not been located and may not exist.
        </h4>
      </section>
    );
  }
  return (
    <section className="adSelections">
      <h3 className="headerWithTip">
        Area Descriptions
      </h3>
      <h4 className="tip">
        click to select
      </h4>

      <ADSearch />

      {(selections && selections.length > 0 && !isSearchingADs) && (
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
};

export default ADSelections;

ADSelections.propTypes = {
  selections: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.bool,
  ]), 
  adId: PropTypes.number.isRequired,
  isSearchingADs: PropTypes.bool.isRequired,
  selectArea: PropTypes.func.isRequired,
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
};

ADSelections.defaultProps = {
  selections: undefined,
};
