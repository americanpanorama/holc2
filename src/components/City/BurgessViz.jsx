import * as React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const BurgessViz = (props) => {
  const {
    width,
    ringStats,
    selectedGrade,
    areaSelected,
    areaUnselected,
  } = props;

  const gradeColors = {
    A: '#418e41',
    B: '#4a4ae4',
    C: '#ffdf00',
    D: '#eb3f3f',
  };

  const getArc = (ringId, startAngle, endAngle) => {
    let innerRadius;
    let outerRadius;
    if (ringId === 1) {
      innerRadius = 0;
      outerRadius = props.width / 18;
    } else {
      innerRadius = props.width / 18 + (ringId - 2) * props.width / 9;
      outerRadius = innerRadius + props.width / 9;
    }
    return d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);
  };

  const pie = d3.pie()
    .value(d => d.percent)
    .sortValues((a, b) => {
      if (a.grade < b.grade) {
        return 1;
      }
      if (a.grade > b.grade) {
        return -1;
      }
      if (a.ringId < b.ringId) {
        return 1;
      }
      return 0;
    });

  const burgessPaddingRatio = 0.93;

  return (
    <svg
      width={width}
      height={width}
      style={{
        marginTop: 20,
      }}
    >
      <image
        x={(width - width * burgessPaddingRatio) / 2}
        y={0.055 * width}
        width={width * burgessPaddingRatio}
        height={width * burgessPaddingRatio}
        opacity={0.5}
        xlinkHref="static/burgess.svg"
      />

      { ringStats.map((ringData, i) => {
        const stackedData = pie(ringData.percents);
        return (
          <g
            key={`burgessRing${i + 1}`}
            transform={`translate(${width / 2} ${width / 2})`}
          >
            { stackedData.map((gradeData) => {
              const {
                startAngle,
                endAngle,
                data,
              } = gradeData;
              const [textX, textY] = getArc(i + 1, startAngle, endAngle).centroid();
              return (
                <g key={`arcFor${i + 1}${data.grade}`}>
                  <path
                    d={getArc(i + 1, startAngle, endAngle)()}
                    fill={gradeColors[data.grade]}
                    stroke={gradeColors[data.grade]}
                    fillOpacity={(!selectedGrade || selectedGrade === data.grade)
                      ? data.opacity : 0}
                    strokeOpacity={(selectedGrade === data.grade) ? 1 : 0}
                    onMouseEnter={areaSelected}
                    onMouseLeave={areaUnselected}
                    id={`${data.ringId}-${data.grade}`}
                  />
                  { (selectedGrade === data.grade) && (
                    <text
                      x={textX}
                      y={textY + 6}
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {`${Math.round(gradeData.data.percent * 100)}%`}
                    </text>
                  )}
                </g>
              );
            })}

            <circle
              cx={0}
              cy={0}
              r={(i === 0) ? 0 : width / 18 + (i - 1) * width / 9}
              fill="transparent"
              stroke="#444"
              style={{ pointerEvents: 'none' }}
            />
          </g>
        );
      })}

    </svg>
  );
};

export default BurgessViz;

BurgessViz.propTypes = {
  width: PropTypes.number.isRequired,
  selectedGrade: PropTypes.string,
  areaSelected: PropTypes.func.isRequired,
  areaUnselected: PropTypes.func.isRequired,
  ringStats: PropTypes.arrayOf(PropTypes.object).isRequired,
};

BurgessViz.defaultProps = {
  selectedGrade: undefined,
};
