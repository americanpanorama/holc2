import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { gradeSelected, gradeUnselected } from '../../store/Dispatchers';

const CityViz = ({ width, selectedGrade, gradeStats, gradeSelected, gradeUnselected }) => {
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
  const gradeColors = {
    A: '#418e41',
    B: '#4a4ae4',
    C: '#ffdf00',
    D: '#eb3f3f',
  };
  const areaWidths = {};
  grades.forEach((grade) => {
    areaWidths[grade] = width / 2 * gradeStats.find(d => d.grade === grade).percent;
    return null;
  });

  return (
    <svg
      width={width}
      height={125}
      style={{
        marginTop: 20,
      }}
    >
      <text
        x={width / 2 - 17}
        y={16}
        textAnchor="end"
        fontSize={16}
        fontWeight={400}
        fill="#666"
      >
        Grade
      </text>

      <text
        x={width / 2 + 10}
        y={16}
        textAnchor="start"
        fontSize={16}
        fontWeight={400}
        fill="#666"
      >
        Area
      </text>

      <g transform="translate(0, 25)">
        {grades.map((grade, i) => (
          <g
            key={`areaFor${grade}`}
            transform={`translate(0, ${i * 25})`}
          >
            <rect
              x={width / 2}
              y={2}
              width={areaWidths[grade]}
              height={14}
              fill={gradeColors[grade]}
              fillOpacity={(!selectedGrade || selectedGrade === grade) ? 1 : 0.25}
            />
            <text
              x={width / 2 - 7}
              y={15}
              textAnchor="end"
              fontSize={16}
              fill={(!selectedGrade || selectedGrade === grade) ? 'black' : 'silver'}
              fontWeight={(selectedGrade && selectedGrade === grade) ? 400 : 'auto'}
            >
              {`${grade} "${labels[grade]}"`}
            </text>
            <text
              x={width / 2 + areaWidths[grade] + 5}
              y={14}
              fontSize={14}
              textAnchor="start"
              fill={(!selectedGrade || selectedGrade === grade) ? '#222' : 'silver'}
            >
              {`${Math.round(gradeStats.find(d => d.grade === grade).percent * 100)}%`}
            </text>
            <rect
              x={0}
              y={-4}
              width={width}
              height={25}
              fill="transparent"
              onMouseEnter={gradeSelected}
              onMouseLeave={gradeUnselected}
              id={grade}
            />
          </g>
        ))}
      </g>
    </svg>
  );
};

CityViz.propTypes = {
  width: PropTypes.number.isRequired,
  selectedGrade: PropTypes.bool,
  gradeStats: PropTypes.arrayOf(PropTypes.object),
  gradeSelected: PropTypes.func.isRequired,
  gradeUnselected: PropTypes.func.isRequired,
};

CityViz.defaultProps = {
  selectedGrade: false,
  gradeStats: undefined,
};

const mapStateToProps = (state) => {
  const { gradeStats } = state.selectedCity.data;
  const { selectedGrade } = state;
  return {
    gradeStats,
    selectedGrade,
    width: 400,
  };
};

const mapDispatchToProps = {
  gradeSelected,
  gradeUnselected,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityViz);
