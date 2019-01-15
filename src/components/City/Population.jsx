import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Population = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const findAndFormatPercent = (year, cat) => {
    const { proportion } = stats[year].percents.filter(pop => (pop.label === cat))[0];
    return (proportion !== null) ? `${Math.round(proportion * 1000) / 10}%` : '---';
  };

  return (
    <table className="population-stats">
      <tbody>
        <tr>
          <th />
          <th>
            1930
          </th>
          <th>
            1940
          </th>
        </tr>
        <tr>
          <td>
            Population
          </td>
          <td
            className="total"
            key="total1930"
          >
            {stats[1930].total.toLocaleString()}
          </td>
          <td
            className="total"
            key="total1940"
          >
            {stats[1940].total.toLocaleString()}
          </td>
        </tr>
        {
          stats.order.map(cat => (
            <tr key={cat}>
              <td>
                {cat}
              </td>
              <td>
                {findAndFormatPercent(1930, cat)}
              </td>
              <td>
                {findAndFormatPercent(1940, cat)}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
};

Population.propTypes = {
  stats: PropTypes.shape({
    1930: PropTypes.object,
    1940: PropTypes.object,
  }),
};

Population.defaultProps = {
  stats: null,
};

const mapStateToProps = (state) => {
  const cityId = state.selectedCity.data.id;
  const { population } = state.cities[cityId];

  if (!population || !population['1940']) {
    return;
  }

  const parsePopSnippetDisplayDataDecade = (popStatsDecade) => {
    let displayData = { total: popStatsDecade.total, percents: [] };

    // if there's data for foreign-born & native-born whites, use that
    if (popStatsDecade.fb_white && popStatsDecade.white) {
      displayData.percents.push({
        label: 'Native-born white',
        proportion: (popStatsDecade.white - popStatsDecade.fb_white) / popStatsDecade.total,
      });
      displayData.percents.push({
        label: 'Foreign-born white',
        proportion: popStatsDecade.fb_white / popStatsDecade.total,
      });
    } else if (popStatsDecade.white) {
      displayData.percents.push({
        label: 'white',
        proportion: popStatsDecade.white / popStatsDecade.total,
      });
    }

    if (popStatsDecade.AfricanAmerican) {
      displayData.percents.push({
        label: 'African American',
        proportion: popStatsDecade.AfricanAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.asianAmerican) {
      displayData.percents.push({
        label: 'Asian American',
        proportion: popStatsDecade.asianAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.nativeAmerican) {
      displayData.percents.push({
        label: 'Native American',
        proportion: popStatsDecade.nativeAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_Chinese) {
      displayData.percents.push({
        label: 'Foreign-born Chinese',
        proportion: popStatsDecade.fb_Chinese / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_Japanese) {
      displayData.percents.push({
        label: 'Foreign-born Japanese',
        proportion: popStatsDecade.fb_Japanese / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_AfricanAmerican) {
      displayData.percents.push({
        label: 'Foreign-born African American',
        proportion: popStatsDecade.fb_AfricanAmerican / popStatsDecade.total,
      });
    }

    return displayData;
  };

  const displayPop = {
    1930: parsePopSnippetDisplayDataDecade(population[1930]),
    1940: parsePopSnippetDisplayDataDecade(population[1940]),
  };

  displayPop[1930].percents = displayPop[1930].percents.filter((pop30) => {
    const pop40 = displayPop[1940].percents.filter(pop40temp => (pop30.label === pop40temp.label));
    if (pop40.length === 0 && pop30.proportion >= 0.005) {
      displayPop[1940].percents.push({
        label: pop30.label,
        proportion: null ,
      });
    }
    return (pop30.proportion >= 0.005);
  });

  displayPop[1940].percents = displayPop[1940].percents.filter((pop40) => {
    const pop30 = displayPop[1930].percents.filter(pop30temp => (pop30temp.label === pop40.label));
    if (pop30.length === 0 && pop40.proportion >= 0.005) {
      displayPop[1930].percents.push({
        label: pop40.label,
        proportion: null,
      });
    }
    return (pop40.proportion >= 0.005);
  });

  displayPop[1940].percents.sort((a, b) => a.proportion < b.proportion);
  displayPop.order = displayPop[1940].percents.map(pop40 => pop40.label);

  return {
    stats: displayPop,
  };
};

export default connect(mapStateToProps)(Population);
