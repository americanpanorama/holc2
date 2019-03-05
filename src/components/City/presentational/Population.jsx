import React from 'react';
import PropTypes from 'prop-types';

const Population = ({ stats }) => {
  if (!stats) {
    return null;
  }

  const findAndFormatPercent = (year, cat) => {
    const { proportion } = stats[year].percents.filter(pop => (pop.label === cat))[0];
    return (proportion !== null) ? `${Math.round(proportion * 1000) / 10}%` : '---';
  };

  return (
    <section>
      <h3>
        Demographics
      </h3>

      <table className="population-stats">
        <tbody>
          <tr>
            <td
              className="total stat"
              key="total1940"
            >
              {stats[1940].total.toLocaleString()}
            </td>
            <td className="cat">
              Total Population (1940)
            </td>
          </tr>
          {
            stats.order.map(cat => (
              <tr key={cat}>
                <td className="stat">
                  {findAndFormatPercent(1940, cat)}
                </td>
                <td className="cat">
                  {cat}
                </td>
              </tr>
            ))
          }
        </tbody>
        </table> 
    {/* JSX Comment 
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
      </table> */}
    </section>
  );
};

export default Population;

Population.propTypes = {
  stats: PropTypes.shape({
    1930: PropTypes.object,
    1940: PropTypes.object,
  }),
};

Population.defaultProps = {
  stats: null,
};
