import React from 'react';
import PropTypes from 'prop-types';

const Population = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <section className="demographics">
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
              {stats.total.toLocaleString()}
            </td>
            <td className="cat">
              Total Population (1940)
            </td>
          </tr>
          {
            stats.percents.map(cat => (
              <tr key={cat.label}>
                <td className="stat">
                  {cat.proportion}
                </td>
                <td className="cat">
                  {cat.label}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
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
