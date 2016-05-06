import React, { PropTypes } from 'react';
import { render } from 'react-dom';
import * as d3 from 'd3';
import { AppActions } from '../utils/AppActionCreator';

export default class CityStats extends React.Component {

	// property validation
	static propTypes = {
		ringStats: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		areaSelected: PropTypes.func,
		areaUnselected: PropTypes.func,
		triggerIntro: PropTypes.func,
		toggleBurgessDiagram: PropTypes.func,
		burgessDiagramVisible: PropTypes.bool,
		cityData: PropTypes.object
	};

	// (instead of ES5-style getDefaultProps)
	static defaultProps = {
		name: '',
		ringStats: {
			1: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'density': 0},
			2: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'density': 0},
			3: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'density': 0},
			4: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'density': 0}
		}
	};

	constructor (props) {
		super(props);
	};

	shouldComponentUpdate(nextProps, nextState) {
		// don't know why this is necessary, but the component is updating on mouseover--this prevents that.
		return (nextProps.burgessDiagramVisible !== this.props.burgessDiagramVisible || nextProps.ringStats !== this.props.ringStats);
	};
	
	componentWillMount () {};

	componentDidMount() {
		this.d3NestedPieChart.onHover = this.props.areaSelected.bind(this);
		this.d3NestedPieChart.onHoverOut = this.props.areaUnselected.bind(this);
		this.triggerIntro = this.triggerIntro.bind(this);
		if (this.props.ringStats) {
			this.d3NestedPieChart.update(this.refs.content, this.props.ringStats);
		}
	}

	componentDidUpdate () {
		this.d3NestedPieChart.destroy(this.refs.content);
		this.d3NestedPieChart.onHover = this.props.areaSelected.bind(this);
		this.d3NestedPieChart.onHoverOut = this.props.areaUnselected.bind(this);
		if (this.props.ringStats) {
			this.d3NestedPieChart.update(this.refs.content, this.props.ringStats);
		}
	}

	areaHover (selectedRingId, selectedGrade) {
		AppActions.ringAreaSelected(selectedRingId, selectedGrade);
	}

	triggerIntro (event) {
		this.props.toggleBurgessDiagram();
		this.props.triggerIntro(event);
	}

	render () {
				
		let burgessClassName = (this.props.burgessDiagramVisible) ? '' : 'hidden',
			  population1930 = (this.props.cityData.population_1930) ? this.props.cityData.population_1930.toLocaleString() : '',
			  population1940 = (this.props.cityData.population_1940) ? this.props.cityData.population_1940.toLocaleString() : '',
			  area = (this.props.area) ? Math.round(this.props.area * 100) / 100 + " sq mi" : '';

		return (
			<div className='stats'>
				<div className='stat-columns'>
				<ul className='left-stat'>
					<li>Population in 1930:</li> <li><span className='state-stat'>{ population1930 }</span></li>
					<li><span className='population-stat'>{ (Math.round(this.props.cityData.white_pop_1930 / this.props.cityData.population_1930 * 100 )) + '%' }</span> white</li><li><span className='population-stat'>{ (Math.round(this.props.cityData.black_pop_1930 / this.props.cityData.population_1930 * 100 )) + '%' }</span> African American</li>
				</ul>
				<ul className='right-stat'>	
					<li>Population in 1940:</li> <li><span className='state-stat'>{ population1940 }</span></li>
					<li><span className='population-stat'>{ (Math.round(this.props.cityData.white_pop_1940 / this.props.cityData.population_1940 * 100 )) + '%' }</span> white</li><li><span className='population-stat'>{ (Math.round(this.props.cityData.black_pop_1940 / this.props.cityData.population_1940 * 100 )) + '%' }</span> African American</li>
					
				</ul>
				<li>Area of city graded: <span className='state-stat'>{ area }</span></li>
				</div>
				<div className='panorama nestedpiechart'>
					<button className='intro-button' data-step='3' onClick={ this.triggerIntro }><span className='icon info'/></button>
					{ (this.props.ringStats) ?
						<div className='content' ref='content'></div> :
						<p>Area descriptions are not yet available but will be eventually.</p>
					}
					<img src='static/burgess.png' className={ burgessClassName } ref="burgessDiagram" id='burgessDiagram' />
				</div>
			</div>
		);
	}

	d3NestedPieChart = {
		that: this,

		// layout constants
		WIDTH: 250,
		HEIGHT: 250, // of the donut
		STATSHEIGHT: 100,
		DONUTWIDTH: 35,

		ringNodes: d3.select(this.refs.content)
			.append('svg')
			.attr('width', this.WIDTH)
			.attr('height', this.HEIGHT + this.STATSHEIGHT),
	
		/**
		 * Logic for updating d3 component with new data.
		 *
	 	 * @param  {Node}    HTMLElement to which d3 will attach
	 	 * @param  {Object}  RingStats (TODO: document expected format)
	 	 */
		update: function(node, ringstats) {

			if (Object.keys(ringstats).length === 0) { 
				this.destroy();
				return; 
			}
			
			let scope = this;	
	
			// format ringstats data
			let formattedStats = [],
				  opacities = [];
			for (let ringId = 1; ringId <= 4; ringId++) {
				formattedStats.push({ percents: [ { percent: ringstats[ringId].A, ringId: ringId, opacity: ringstats[ringId].density, grade: "A" }, { percent: ringstats[ringId].B, ringId: ringId, opacity: ringstats[ringId].density, grade: "B" }, { percent: ringstats[ringId].C, ringId: ringId, opacity: ringstats[ringId].density, grade: "C" }, { percent: ringstats[ringId].D, ringId: ringId, opacity: ringstats[ringId].density, grade: "D" } ] });
			}
	
			var color = function(i) { return ['#418e41', '#4a4ae4', '#f4f570', '#eb3f3f'][i]; };
			var colorBorder = function(i) { return ['#418e41', '#4a4ae4', '#A3A34B', '#eb3f3f'][i]; };
			var pie = d3.layout.pie()
				.value((d) => d.percent)
				.sort(null);
			var arc = d3.svg.arc()
				.innerRadius((d) => (d.data.ringId - 1.5) * scope.DONUTWIDTH)
				.outerRadius((d) => (d.data.ringId - 0.5) * scope.DONUTWIDTH);
			var arcover = d3.svg.arc()
				.innerRadius((d) => (d.data.ringId - 1.5) * scope.DONUTWIDTH)
				.outerRadius((d) => (d.data.ringId - 0.5) * scope.DONUTWIDTH + 4);
			var arcBorder = d3.svg.arc()
				.innerRadius((d) => (d.data.ringId - 0.5) * scope.DONUTWIDTH)
				.outerRadius((d) => (d.data.ringId - 0.5) * scope.DONUTWIDTH);
			var percent = d3.format(",%");
	
			// <g> for each ring
			let ringNodes = d3.select(node)
				.append('svg')
				.attr('width', scope.WIDTH)
				.attr('height', scope.HEIGHT + scope.STATSHEIGHT)
				.attr('id', 'piechart')
				.selectAll('g')
				.data(formattedStats)
				.enter().append('g')
				.attr('transform', 'translate(' + (scope.WIDTH / 2) + ',' + (scope.HEIGHT / 2) + ')');
	
			// path for each pie piece
			ringNodes
			  .selectAll('path')
			  .data((d) => pie(d.percents) )
			  .enter().append('path')
			  .attr('d', arc)
			  .attr('fill', (d,i) => color(i))
			  .attr("stroke", (d,i) => color(i))
			  .attr("stroke-width", 0)
			  .attr("stroke-opacity", 1)
			  .attr('fill-opacity', (d) => d.data.opacity)
			  .on("mouseover", function(d) {
				  d3.select(this)
					  .transition()
					  .duration(500)
					  //.attr('d', arcover)
				  	.attr("stroke-width", 0)
				  	.attr('fill-opacity', 1); //(d) => d.data.opacity * 6);
				  d3.select('#ring' + d.data.ringId + "grade" + d.data.grade )
				    .attr("fill", "black");
				  scope.onHover(d.data.ringId, d.data.grade);
			  })
			  .on("mouseout", function(d) {
				  scope.onHoverOut();
				  d3.select(this)
					  .transition()
					  .attr('d', arc)
					  .attr("stroke-width", 0)
					  .attr('fill-opacity', (d) => d.data.opacity);
				  d3.select('#ring' + d.data.ringId + "grade" + d.data.grade )
					  .attr("fill", "transparent");
			  });	

			// add thin stroke line for each slice of pie
			ringNodes
			  .selectAll('path.border')
			  .data((d) => pie(d.percents) )
			  .enter().append('path')
			  .classed('border', true)
			  .attr('d', arcBorder)
			  .attr('fill', (d,i) => color(i))
			  .attr("stroke", (d,i) => colorBorder(i))
			  .attr("stroke-width", 0.25)
			  .attr("stroke-opacity", 0.7);

			ringNodes.append("g")
			  .attr('class', 'labels');
			

			// add text for each slice of pie
			ringNodes
			  .selectAll('text')
			  .data(formattedStats)
			  .enter().append('text')
			  .attr("dx", -100)
			  .attr("dy", scope.HEIGHT / 2 + 25)
			  .attr("fill", "transparent")
			  .attr("id", function(d, i,j) { return 'ring' + d.percents[j].ringId + 'grade' + d.percents[j].grade })
			  .text((d, i, j) => {
				  percent(d.percents[j].percent) + '(' + percent(d.percents[j].opacity) + ') of the graded section of the ring.'
			  });


		},

		onHover: function() {
			// bound in componentDidMount to the areaSelected method of App (passed in as a props)
		},

		onHoverOut: function() {
			// bound in componentDidMount to the areaUnselected metthod of App
		},
	
		destroy: function (node) {
			d3.select(node).html('');
		}
	
	
	}

};
