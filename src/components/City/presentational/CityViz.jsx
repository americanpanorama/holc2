import * as React from 'react';
import PropTypes from 'prop-types';
import { constantsColors, constantsLightenedColors } from '../../../../data/constants';

const CityViz = ({ width, selectedGrade, gradeStats, selectGrade, unselectGrade }) => {
  if (!gradeStats) {
    return null;
  }

  const grades = ['A', 'B', 'C', 'D'];
  const labels = {
    A: 'Best',
    B: 'Still Desirable',
    C: 'Definitely Declining',
    D: 'Hazardous',
  };

  const areaWidths = {};
  grades.forEach((grade) => {
    areaWidths[grade] = (width * 0.45 - 10) * gradeStats.find(d => d.grade === grade).percent;
    return null;
  });

  return (
    <section className="cityViz">
      <h3>
        Areas by Grade
      </h3>
      <h4>
        Hover over grades for explanation &
        <br />to highlight those areas on the map
      </h4>
      <svg
        width={width}
        height={270}
        style={{
          marginTop: 20,
        }}
      >
        <text
          x={width * 0.45 - 10}
          y={16}
          textAnchor="end"
          fontWeight={400}
          fill="#666"
        >
          Area
        </text>

        <text
          x={width * 0.45 + 10}
          y={16}
          textAnchor="start"
          fontWeight={400}
          fill="#666"
        >
          Grade
        </text>

        <g transform="translate(0, 25)">
          {grades.map((grade, i) => (
            <g
              key={`areaFor${grade}`}
              transform={`translate(0, ${i * 25})`}
            >
              <rect
                x={(width * 0.45 - 10) - areaWidths[grade]}
                y={2}
                width={areaWidths[grade]}
                height={14}
                fill={constantsColors[`grade${grade}`]}
                fillOpacity={(!selectedGrade || selectedGrade === grade) ? 1 : 0.1}
              />
              <text
                x={width * 0.45 + 10}
                y={15}
                textAnchor="start"
                fill="black"
                fillOpacity={(!selectedGrade || selectedGrade === grade) ? 1 : 0.1}
                fontWeight={(selectedGrade && selectedGrade === grade) ? 400 : 'auto'}
              >
                {`${grade} "${labels[grade]}"`}
              </text>
              <text
                x={(width * 0.45 - 10) - areaWidths[grade] - 5}
                y={14}
                textAnchor="end"
                fill={(!selectedGrade || selectedGrade === grade) ? '#222' : 'silver'}
                className="stat"
              >
                {`${Math.round(gradeStats.find(d => d.grade === grade).percent * 100)}%`}
              </text>
              <rect
                x={0}
                y={-4}
                width={width}
                height={25}
                fill="transparent"
                onMouseEnter={selectGrade}
                onMouseLeave={unselectGrade}
                id={grade}
              />
            </g>
          ))}
        </g>

        {(selectedGrade === 'A') && (
          <g
            transform={`translate(${width / 2 - 199}, 50)`}
            style={{ pointerEvents: 'none' }}
          >
            <rect
              x={0}
              y={0}
              width={398}
              height={5 * 1.4 * 16}
              rx={10}
              ry={10}
              fill={constantsLightenedColors.gradeA}
              fillOpacity={0.9}
              stroke={constantsColors.gradeA}
            />
            <text
              x={0}
              y={25}
              fill="black"
              fontSize="16px"
              textAnchor="start"
            >
              <tspan
                x={10}
                dy="0"
              >
                HOLC described A areas as "'hot spots' ... where
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                good mortgage lenders with available funds are
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                willing to make their maximum loans ...
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                &#8212;perhaps up to 75-80% of appraisal."
              </tspan>
            </text>
          </g>
        )}

        {(selectedGrade === 'B') && (
          <g transform={`translate(${width / 2 - 199}, 75)`}>
            <rect
              x={0}
              y={0}
              width={398}
              height={6 * 1.4 * 16}
              rx={10}
              ry={10}
              fill={constantsLightenedColors.gradeB}
              fillOpacity={0.9}
              stroke={constantsColors.gradeB}
            />
            <text
              x={0}
              y={25}
              fill="black"
              fontSize="16px"
              textAnchor="start"
            >
              <tspan
                x={10}
                dy="0"
              >
                HOLC described B areas as "still good" but not
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                as "hot" as A areas. "They are neighborhoods
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                where good mortgage lenders will have a
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                tendency to hold commitments 10-15%
              </tspan>
              <tspan
                x={10}
                dy="1.4em"
              >
                under the limit," or around 65% of appraisal.
              </tspan>
            </text>
          </g>
        )}

        {(selectedGrade === 'C') && (
          <g transform={`translate(${width / 2 - 199}, 100)`}>
            <rect
              x={0}
              y={0}
              width={398}
              height={7 * 1.4 * 16}
              rx={10}
              ry={10}
              fill={constantsLightenedColors.gradeC}
              fillOpacity={0.9}
              stroke={constantsColors.gradeC}
            />
            <text
              x={0}
              y={25}
              fill="black"
              fontSize="16px"
              textAnchor="start"
            >
              <tspan
                x={10}
                dy="0"
              >
                C neighborhoods were characterized by 
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                "obsolecence [and] infiltration of lower grade
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                population." "Good mortgage lenders are more 
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                conservative in Third grade or C areas and hold
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
               commitments under the lending ratio for the A
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
               and B areas."
              </tspan>
            </text>
          </g>
        )}

        {(selectedGrade === 'D') && (
          <g transform={`translate(${width / 2 - 199}, 125)`}>
            <rect
              x={0}
              y={0}
              width={398}
              height={6 * 1.4 * 16}
              rx={10}
              ry={10}
              fill={constantsLightenedColors.gradeD}
              fillOpacity={0.9}
              stroke={constantsColors.gradeD}
            />
            <text
              x={0}
              y={25}
              fill="black"
              fontSize="16px"
              textAnchor="start"
            >
              <tspan
                x={10}
                dy="0"
              >
                HOLC described D areas as "characterized by 
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                detrimental influences in a pronounced degree,
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                underdesirable population or an infiltration of
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                it." They recommended lenders "refuse to make
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                loans in these areas [or] only on a conservative
              </tspan>
              <tspan
                x={10}
                dy="1.2em"
              >
                basis."
              </tspan>
            </text>
          </g>
        )}

      </svg>
    </section>
  );
};

CityViz.propTypes = {
  width: PropTypes.number.isRequired,
  selectedGrade: PropTypes.string,
  gradeStats: PropTypes.arrayOf(PropTypes.object),
  selectGrade: PropTypes.func.isRequired,
  unselectGrade: PropTypes.func.isRequired,
};

CityViz.defaultProps = {
  selectedGrade: false,
  gradeStats: undefined,
};

export default CityViz;
