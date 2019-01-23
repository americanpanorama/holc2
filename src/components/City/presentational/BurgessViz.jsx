import * as React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

class BurgessViz extends React.Component {
  constructor(props) {
    super();
    const opacities = props.ringStats.map(d => ({
      A: d.percents[0].opacity,
      B: d.percents[0].opacity,
      C: d.percents[0].opacity,
      D: d.percents[0].opacity,
    }));
    this.state = {
      opacities
    };

    this.rings = [0, 1, 2, 3].map(r => ({
      A: React.createRef(),
      B: React.createRef(),
      C: React.createRef(),
      D: React.createRef(),
    }));
  }

  componentDidUpdate() {
    const { selectedGrade, ringStats } = this.props;
    const opacities = ringStats.map(d => ({
      A: d.percents[0].opacity,
      B: d.percents[0].opacity,
      C: d.percents[0].opacity,
      D: d.percents[0].opacity,
    }));
    if (selectedGrade) {
      [0, 1, 2, 3].forEach((r) => {
        ['A', 'B', 'C', 'D'].forEach((g) => {
          const el = this.rings[r][g].current;
          d3.select(el)
            .selectAll('path')
            .transition()
            .duration(1000)
            .attr('fill-opacity', (g === selectedGrade) ? 1 : 0.05)
            .on('end', () => {
              const newOpacities = { ...this.state.opacities };
              newOpacities[r][g] = opacities[r][g];
              this.setState({
                opacities: newOpacities,
              });
            });
        });
      });
    }
  }

  render() {
    const {
      width,
      ringStats,
      selectedRingGrade,
      selectedGrade,
      areaSelected,
      areaUnselected,
    } = this.props;

    if (!ringStats || ringStats.length === 0) {
      return null;
    }

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
        outerRadius = width / 18;
      } else {
        innerRadius = width / 18 + (ringId - 2) * width / 9;
        outerRadius = innerRadius + width / 9;
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

    const { opacities } = this.state;

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
                const { startAngle, endAngle, data } = gradeData;
                const [textX, textY] = getArc(i + 1, startAngle, endAngle).centroid();
                let fillOpacity = opacities[i][data.grade];
                return (
                  <g
                    key={`arcFor${i + 1}${data.grade}`}
                    ref={this.rings[i][data.grade]}
                  >
                    <path
                      d={getArc(i + 1, startAngle, endAngle)()}
                      fill={gradeColors[data.grade]}
                      stroke={gradeColors[data.grade]}
                      fillOpacity={fillOpacity}
                      strokeOpacity={(selectedRingGrade === data.grade) ? 1 : 0}
                      onMouseEnter={areaSelected}
                      onMouseLeave={areaUnselected}
                      id={`${data.ringId}-${data.grade}`}
                    />
                    { (selectedRingGrade === data.grade) && (
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
  }
}

BurgessViz.propTypes = {
  width: PropTypes.number.isRequired,
  selectedRingGrade: PropTypes.shape({
    ring: PropTypes.number,
    grade: PropTypes.string,
  }),
  selectedGrade: PropTypes.string,
  areaSelected: PropTypes.func.isRequired,
  areaUnselected: PropTypes.func.isRequired,
  ringStats: PropTypes.arrayOf(PropTypes.object),
};

BurgessViz.defaultProps = {
  selectedRingGrade: undefined,
  selectedGrade: undefined,
  ringStats: undefined,
};

export default BurgessViz;
