import React from 'react';
import PropTypes from 'prop-types';

export default class ADSearchSnippet extends React.Component {
  render() {
    const { searchingADsFor, adId, options, FormComponent, onOptionSelected, highlightArea, unhighlightArea } = this.props;

    if (!searchingADsFor || searchingADsFor.length <= 1) {
      return null;
    }

    const getKIC = (str) => {
      const keywordsInContext = [];
      const rawseq = str.split(' ');
      let lastEnd = -1;
      rawseq.forEach((word, j) => {
        if (word.toLowerCase().includes(searchingADsFor.toLowerCase()) && j > lastEnd) {
          const begin = (j - 12 > 0) ? j - 12 : 0;
          const end = (j + 11 < rawseq.length - 1) ? j + 11 : rawseq.length;
          const seq = rawseq.slice(begin, end);
          lastEnd = end;
          if (begin > 0) {
            seq[0] = `... ${seq[0]}`;
          }
          if (end < rawseq.length - 1) {
            seq[seq.length - 1] = `${seq[seq.length - 1]} ...`;
          }
          keywordsInContext.push(seq.join(' '));
        }
      });
      return keywordsInContext.join(' | ');
    };

    return (
      <div>
        <h4>
          Search Results
        </h4>
        {options.map((d) => {
          const searchResults = {};
          Object.keys(d.areaDesc).forEach((cat) => {
            if (typeof d.areaDesc[cat] === 'string' && d.areaDesc[cat].toLowerCase().includes(searchingADsFor.toLowerCase())) {
              searchResults[cat] = getKIC(d.areaDesc[cat]);
            } else if (typeof d.areaDesc[cat] === 'object') {
              Object.keys(d.areaDesc[cat]).forEach((subcat1) => {
                if (typeof d.areaDesc[cat][subcat1] === 'string' && d.areaDesc[cat][subcat1].toLowerCase().includes(searchingADsFor.toLowerCase())) {
                  searchResults[cat] = searchResults[cat] || {};
                  searchResults[cat][subcat1] = getKIC(d.areaDesc[cat][subcat1]);
                } else if (typeof d.areaDesc[cat][subcat1] === 'object') {
                  Object.keys(d.areaDesc[cat][subcat1]).forEach((subcat2) => {
                    if (typeof d.areaDesc[cat][subcat1][subcat2] === 'string' && d.areaDesc[cat][subcat1][subcat2].toLowerCase().includes(searchingADsFor.toLowerCase())) {
                      searchResults[cat] = searchResults[cat] || {};
                      searchResults[cat][subcat1] = searchResults[cat][subcat1] || {};
                      searchResults[cat][subcat1][subcat2] = getKIC(d.areaDesc[cat][subcat1][subcat2]);
                    }
                  });
                }
              });
            }
          });
          return (
            <div
              onClick={onOptionSelected}
              onMouseEnter={highlightArea}
              onMouseLeave={unhighlightArea}
              id={`${adId}-${d.holcId}`}
              className={`adSearchResult grade${d.grade}`}
              key={`adSearchResultFor-${adId}-${d.holcId}`}
            >

              <h4>
                {`${d.holcId} ${(d.name) ? d.name : ''}`}
              </h4>

              <FormComponent
                adData={searchResults}
              />
            </div>
          );
        })}
      </div>
    );
  }
}


ADSearchSnippet.propTypes = {
  searchingADsFor: PropTypes.string,
  adId: PropTypes.number.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  FormComponent: PropTypes.func.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
  highlightArea: PropTypes.func.isRequired,
  unhighlightArea: PropTypes.func.isRequired,
};

ADSearchSnippet.defaultProps = {
  searchingADsFor: null,
};
