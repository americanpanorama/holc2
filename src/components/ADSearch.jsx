import React, { PropTypes } from 'react';
import { AppActionTypes } from '../utils/AppActionCreator';
import { Typeahead } from 'react-typeahead';


export default class ADSearch extends React.Component {

	constructor () {
		super();
		
		const handlers = ['renderNSForm8_19370203','renderNSForm8_19371001', 'renderQualitative', 'renderSimpleCategory', 'renderSimpleSubcategory', 'renderSimpleData', 'render1939'];
		handlers.map(handler => { this[handler] = this[handler].bind(this); });
	}

	renderNSForm8_19370203(AD) {
		if (AD === false) {
			return;
		}

		return (

			<ul className='area_description NSForm8'>
				{ this.renderSimpleCategory(AD, 14, 'Clarifying Remarks') }
				{ (AD[5]) ?
					<li>
						<span className='catNum'>5</span>
						<span className='catName'>Inhabitants</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 5, 'e', 'Infiltration of') }
							{ this.renderSimpleSubcategory(AD, 5, 'f', 'Relief families') }
							{ (AD[5]['c']) ?
								<li>
									<span className='catLetter'>c</span>
									<span className='subcatName'>Foreign-born</span>
									<span className='subcatData'>{ (AD[5] && AD[5]['c']['1'] ) ? AD[5]['c']['1'] : <span className='empty'>empty</span> }; { (AD[5] && AD[5]['c']['2'] ) ? AD[5]['c']['2'] : <span className='empty'>empty</span> }</span>
								</li> : ''
							}
							{ (AD[5]['d']) ? 
								<li>
									<span className='catLetter'>d</span>
									<span className='subcatName'>Negro</span>
									<span className='subcatData'>{ (AD[5] && AD[5]['d']['1'] ) ? AD[5]['d']['1'] : <span className='empty'>empty</span> }; { (AD[5] && AD[5]['d']['2'] ) ? AD[5]['d']['2'] : <span className='empty'>empty</span> }</span>
								</li> : ''
							}
							{ this.renderSimpleSubcategory(AD, 5, 'a', 'Type') }
							{ this.renderSimpleSubcategory(AD, 5, 'b', 'Estimated annual family income') }
							{ (AD[5]['g']) ? 
								<li>
									<span className='catLetter'>g</span>
									<span className='subcatName'>Population is increasing</span>
									<span className='subcatData'>{ (AD[5] && AD[5]['g']['1'] ) ? AD[5]['g']['1'] : <span className='empty'>empty</span> }</span>
									<span className='subcatName'>; decreasing</span>
									<span className='subcatData'>{ (AD[5] && AD[5]['g']['2'] ) ? AD[5]['g']['2'] : <span className='empty'>empty</span> }</span>; 
									<span className='subcatName'>; static</span>
								</li> : ''
							}
						</ul>
						
					</li> : ''
				}

				{ this.renderSimpleCategory(AD, 2, 'Description of Terrain') }
				{ this.renderSimpleCategory(AD, 3, 'Favorable Influences') }
				{ this.renderSimpleCategory(AD, 4, 'Detrimental Influences') }

				{ (AD[6]) ?
					<li>
						<span className='catNum'>6</span>
						<span className='catName'>Buildings</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 6, 'a', 'Type or Types') }
							{ this.renderSimpleSubcategory(AD, 6, 'b', 'Type of construction') }
							{ this.renderSimpleSubcategory(AD, 6, 'c', 'Average age') }
							{ this.renderSimpleSubcategory(AD, 6, 'd', 'Repair') }
						</ul>
					</li> : ''
				}

				{ (AD[8]) ?
					<li>
						<span className='catNum'>8</span>
						<span className='catName'>Occupancy</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 8, 'a', 'Land') }
							{ this.renderSimpleSubcategory(AD, 8, 'b', 'Dwelling units') }
							{ this.renderSimpleSubcategory(AD, 8, 'c', 'Home Owners') }
						</ul>
					</li> : ''
				}

				{ (AD[9]) ?
					<li>
						<span className='catNum'>9</span>
						<span className='catName'>Sales Demand</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 9, 'a', '') }
							{ this.renderSimpleSubcategory(AD, 9, 'b', '') }
							{ this.renderSimpleSubcategory(AD, 9, 'c', 'Activity is') }
						</ul>
					</li> : ''
				}

				{ (AD[10]) ?
					<li>
						<span className='catNum'>10</span>
						<span className='catName'>Rental Demand</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 10, 'a', '') }
							{ this.renderSimpleSubcategory(AD, 10, 'b', '') }
							{ this.renderSimpleSubcategory(AD, 10, 'c', 'Activity is') }
						</ul>
					</li> : ''
				}

				{ (AD[11]) ?
					<li>
						<span className='catNum'>11</span>
						<span className='catName'>New Construction</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 11, 'a', 'Types') }
							{ this.renderSimpleSubcategory(AD, 11, 'b', 'Amount last year') }
						</ul>
					</li> : ''
				}

				{ (AD[12]) ?
					<li>
						<span className='catNum'>12</span>
						<span className='catName'>Availability of Mortgage Funds</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 12, 'a', 'Home purchase') }
							{ this.renderSimpleSubcategory(AD, 12, 'b', 'Home building') }
						</ul>
					</li> : ''
				}

				{ this.renderSimpleCategory(AD, 13, 'Trend of Desireability Next 10-15 Years') }

				{ (AD[15]) ?
					<li>
						<span className='catNum'>15</span>
						<span className='catName'>Information for this form was obtained from</span>
						<span className='subcatData'>{ (AD[15]  && typeof(AD[15]) == 'string' ) ? AD[15] : (AD[15] && AD[15][1]) ? AD[15][1] : '' }</span>
					</li> : ''
				}
			</ul>
		);
	}

	renderNSForm8_19371001(AD) {
		if (AD === false) {
			return;
		}

		return (
			<ul className='area_description NSForm8'>
				{ this.renderSimpleCategory(AD, 5, 'Clarifying Remarks') }
				{ (AD[2]) ? 
					<li>
						<span className='catNum'>2</span>
						<span className='catName'>Inhabitants</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 2, 'e', 'Infiltration of') }
							{ (AD[2]['c']) ? 
								<li>
									<span className='catLetter'>c</span>
									<span className='catName'>Foreign-born families</span>
									<span className='subcatData'>{ this.renderSimpleData(AD, 2, 'c', 1) }</span>
									<span className='catName'>%;</span>
									<span className='subcatData'> { this.renderSimpleData(AD, 2, 'c', 2) }</span>
									<span className='catName'>  predominating</span>
								</li> : ''
							}
							{ (AD[2]['d']) ? 
								<li>
									<span className='catLetter'>d</span>
									<span className='catName'>Negro</span>
									<span className='subcatData'>{ this.renderSimpleData(AD, 2, 'd', 1) }</span>
									<span className='catName'>%;</span>
									<span className='subcatData'> { this.renderSimpleData(AD, 2, 'd', 2) }</span>
									<span className='catName'>  predominating</span>
								</li> : ''
							}
							{ this.renderSimpleSubcategory(AD, 2, 'f', 'Relief families') }
							{ this.renderSimpleSubcategory(AD, 2, 'a', 'Occupation') }
							{ this.renderSimpleSubcategory(AD, 2, 'b', 'Estimated Annual Family Income') }
						</ul>
					</li> : ''
				}
				{ (AD[1]) ? 
					<li>
						<span className='catNum'>1</span>
						<span className='catName'>Area Characteristics</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 1, 'a', 'Description of Terrain') }
							{ this.renderSimpleSubcategory(AD, 1, 'b', 'Favorable Influences') }
							{ this.renderSimpleSubcategory(AD, 1, 'c', 'Detrimental Influences') }
							{ this.renderSimpleSubcategory(AD, 1, 'd', 'Percentage of land improved') }
							{ this.renderSimpleSubcategory(AD, 1, 'e', 'Trend of desireability next 10-15 yrs.') }
						</ul>
					</li> : ''
				}
			</ul>
		);
	}

	render1939(AD) {
		if (AD === false) {
			return;
		}

		return (

			<ul className='area_description NSForm8'>
				{ this.renderSimpleCategory(AD, 8, 'Description and Characteristics of Area') }

				{ (AD[1]) ?
					<li>
						<span className='catNum'>5</span>
						<span className='catName'>Inhabitants</span>
						<ul>
							{ (AD[1].a) ? 
								<li>
									<span className='catLetter'>a</span>
									<span className='catName'>Increasing</span>
									<span className='subcatData'>{ this.renderSimpleData(1, 'a', 1) }</span><br />
									<span className='catName'> Decreasing</span>
									<span className='subcatData'> { this.renderSimpleData(1, 'a', 2) }</span><br />
									<span className='catName'> Static</span>
									<span className='subcatData'> { this.renderSimpleData(1, 'a', 3) }</span>
								</li> : ''
							}
							{ this.renderSimpleSubcategory(AD, 1, 'b', 'Class and Occupation') }
							{ (AD[1].c) ? 
								<li>
									<span className='catLetter'>c</span>
									<span className='catName'>Foreign Families</span>
									<span className='subcatData'>{ this.renderSimpleData(1, 'c', 1) }</span><br />
									<span className='catName'> Nationalities</span>
									<span className='subcatData'> { this.renderSimpleData(1, 'c', 2) }</span>
								</li> : ''
							}
							{ this.renderSimpleSubcategory(AD, 1, 'd', 'Negro') }
							{ this.renderSimpleSubcategory(AD, 1, 'e', 'Shifting or Infiltration') }
							
							
						</ul>
					</li> : ''
				}

				{ (AD[2]) ? 
					<li>
						<span className='catNum'>2</span>
						<span className='catName'>Buildings</span>

						<table>
							<tbody>
								<tr>
									<th></th>
									<th colSpan={2}>Predominating { this.renderSimpleData(AD, 2, '', 1) }%</th>
									<th colSpan={2}>Other Type { this.renderSimpleData(AD, 2, '', 2) }%</th>
								</tr>
								{ (AD[2].a) ? 
									<tr>
										<td>
											<span className='catLetter'>a</span>
											<span className='catName'>Type and Size</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'a', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'a', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].b) ? 
									<tr>
										<td>
											<span className='catLetter'>b</span>
											<span className='catName'>Construction</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'b', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'b', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].c) ? 
									<tr>
										<td>
											<span className='catLetter'>c</span>
											<span className='catName'>Average Age</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'c', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'c', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].d) ? 
									<tr>
										<td>
											<span className='catLetter'>d</span>
											<span className='catName'>Repair</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'd', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'd', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].e) ? 
									<tr>
										<td>
											<span className='catLetter'>e</span>
											<span className='catName'>Occupancy</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'e', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'e', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].f) ? 
									<tr>
										<td>
											<span className='catLetter'>f</span>
											<span className='catName'>Owner-occupied</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'f', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'f', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].g) ? 
									<tr>
										<td>
											<span className='catLetter'>g</span>
											<span className='catName'>1935 Price Bracket</span>
										</td>
										<td>${ this.renderSimpleData(AD, 2, 'g', 1) }</td>
										<th>% change</th>
										<td>${ this.renderSimpleData(AD, 2, 'g', 2) }</td>
										<th>% change</th>
									</tr> : ''
								}
								{ (AD[2].h) ? 
									<tr>
										<td>
											<span className='catLetter'>h</span>
											<span className='catName'>1937 Price Bracket</span>
										</td>
										<td>${ this.renderSimpleData(AD, 2, 'h', 1) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'h', 2) }%</td>
										<td>${ this.renderSimpleData(AD, 2, 'h', 3) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'h', 4) }%</td>
									</tr> : ''
								}
								{ (AD[2].i) ? 
									<tr>
										<td>
											<span className='catLetter'>i</span>
											{ this.renderSimpleData(AD, 2, 'i', 1) } <span className='catName'>Price Bracket</span>
										</td>
										<td>${ this.renderSimpleData(AD, 2, 'i', 2) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'i', 3) }%</td>
										<td>${ this.renderSimpleData(AD, 2, 'i', 4) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'i', 5) }%</td>
									</tr> : ''
								}
								{ (AD[2].j) ? 
									<tr>
										<td>
											<span className='catLetter'>j</span>
											<span className='catName'>Sales Demand</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'j', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'j', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].k) ? 
									<tr>
										<td>
											<span className='catLetter'>k</span>
											<span className='catName'>Predicted Price Trend<br />(next 6-12 months)</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'k', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'k', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].l) ? 
									<tr>
										<td>
											<span className='catLetter'>l</span>
											<span className='catName'>1935 Rent Bracket</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'l', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'l', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].m) ? 
									<tr>
										<td>
											<span className='catLetter'>m</span>
											<span className='catName'>1937 Rent Bracket</span>
										</td>
										<td>${ this.renderSimpleData(AD, 2, 'm', 1) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'm', 2) }%</td>
										<td>${ this.renderSimpleData(AD, 2, 'm', 3) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'm', 4) }%</td>
									</tr> : ''
								}
								{ (AD[2].n) ? 
									<tr>
										<td>
											<span className='catLetter'>n</span>
											{ this.renderSimpleData(AD, 2, 'n', 1) }<span className='catName'>Rent Bracket</span>
										</td>
										<td>${ this.renderSimpleData(AD, 2, 'n', 2) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'n', 3) }%</td>
										<td>${ this.renderSimpleData(AD, 2, 'n', 4) }</td>
										<td>{ this.renderSimpleData(AD, 2, 'n', 5) }%</td>
									</tr> : ''
								}
								{ (AD[2].o) ? 
									<tr>
										<td>
											<span className='catLetter'>o</span>
											<span className='catName'>Rental Demand</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'o', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'o', 2) }</td>
									</tr> : ''
								}
								{ (AD[2].p) ? 
									<tr>
										<td>
											<span className='catLetter'>p</span>
											<span className='catName'>Predicted Rent Trend<br />(next 6-12 months)</span>
										</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'p', 1) }</td>
										<td colSpan={2}>{ this.renderSimpleData(AD, 2, 'p', 2) }</td>
									</tr> : ''
								}
							</tbody>
						</table>
					</li> : ''
				}
				{ (AD[3]) ?
					<li>
						<span className='catNum'>3</span>
						<span className='catName'>New Construction (past yr.)</span>
						<div>
							<span className='subcatName'>No.</span> { this.renderSimpleData(AD, 3, '', 1) }
							<span className='subcatName'>Type &amp; Price</span> { this.renderSimpleData(AD, 3, '', 2) }
							<span className='subcatName'>How Selling</span> { this.renderSimpleData(AD, 3, '', 3) }
						</div>
					</li> : ''
				}
				{ (AD[4]) ?
					<li>
						<span className='catNum'>4</span>
						<span className='catName'>Overhang of Home Properties</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 4, 'a', 'HOLC') }
							{ this.renderSimpleSubcategory(AD, 4, 'b', 'Institutions') }
						</ul>
					</li> : ''
				}
				{ (AD[5]) ?
					<li>
						<span className='catNum'>5</span>
						<span className='catName'>Sale of Home Properties</span>
						<ul>
							{ this.renderSimpleSubcategory(AD, 5, 'a', 'HOLC') }
							{ this.renderSimpleSubcategory(AD, 5, 'b', 'Institutions') }
						</ul>
					</li> : ''
				}
				{ this.renderSimpleCategory(AD, 6, 'Mortgage Funds') }
				{ (AD[7]) ?
					<li>
						<span className='catNum'>7</span>
						<span className='catName'>Total Tax Rate Per $1000 (193</span>{ this.renderSimpleData(AD, 7, '', 1) }<span className='catName'>)</span>
						<span className='catData'>{ this.renderSimpleData(AD, 7, '', 2) }</span>
					</li> : ''
				}
			</ul>


		);
	}

	renderQualitative(AD) {
		console.log(AD);
		if (AD === false || !AD[1]) {
			return;
		}

		return(
			<div className='area_description qualitative'>
				{ AD[1] }
			</div>
		)
	}

	renderSimpleCategory(AD, catNum, catName) {	
		return (AD[catNum]) ? 
			<li key={'AD-' + catNum}>
				<span className='catNum'>{ catNum }</span>
				<span className='catName'>{ catName }</span>
				<span className='catData'>{ AD[catNum]}</span>
			</li> : '';
	}

	renderSimpleSubcategory(AD, catNum, catLetter, subcatName) {
		return (AD[catNum][catLetter]) ?
			<li>
				<span className='catLetter'>{ catLetter }</span>
				<span className='subcatName'>{ subcatName }</span>
				<span className='subcatData'>{ AD[catNum][catLetter] }</span>
			</li> : ''
	}

	renderSimpleData(AD, catNum, subcatLetter = '', order = null) {
		if (order == null) {
			return (
				<span>{ (AD[catNum] && AD[catNum][subcatLetter] ) ? AD[catNum][subcatLetter] : <span className='empty'>empty</span> }</span>
			);
		} else if (subcatLetter == '') {
			return (
				<span>{ (AD[catNum] && AD[catNum][order] ) ? AD[catNum][order] : <span className='empty'>empty</span> }</span>
			);
		} else {
			return (
				<span>{ (AD[catNum] && AD[catNum][subcatLetter] && AD[catNum][subcatLetter][order] ) ? AD[catNum][subcatLetter][order] : <span className='empty'>empty</span> }</span>
			);
		}
	}

	render () {

		let renderForm = () => null;
		switch(parseInt(this.props.formId)) {
			case 19370203:
			case 19370601:
			case 19370826:
				renderForm = this.renderNSForm8_19370203;
				break;
			case 19371001:
				renderForm = this.renderNSForm8_19371001;
				break;
			case 1939:
				renderForm = this.render1939;
				break;
			case 1: 
				renderForm = this.renderQualitative;
				break;
		}

		return (
		<Typeahead
			options={ this.props.forAdSearch }
			placeholder={ 'Search area descriptions' }
			//filterOption={ 'value' }
			customClasses={{
				input: 'adSearchInput',
				listItem: 'areaDescription'
			}}
			displayOption={(adItem, i) => { 
				let searchValue = this.refs.adSearch.refs.entry.value;
				let regexp = new RegExp(searchValue, "gi");
				let searchResults = {};

				const getKIC = function(str) {
					let keywords_in_context = [],
						rawseq = str.split(' '),
						lastEnd = -1;
					rawseq.forEach((word,j) => {
						if (word.toLowerCase().includes(searchValue.toLowerCase()) && j > lastEnd) {
							const begin = (j-12>0) ? j-12 : 0,
								end = (j+11<rawseq.length-1) ? j+11 : rawseq.length,
								seq = rawseq.slice(begin, end);
							lastEnd = end;
							if (begin > 0) {
								seq[0] = "... " + seq[0];
							}
							if (end<rawseq.length-1) {
								seq[seq.length-1] += " ...";
							}
							keywords_in_context.push(seq.join(' '));
						}
					});
					return keywords_in_context.join(' | ');
				};

				Object.keys(adItem.areaDesc).forEach(cat => {
					if (typeof adItem.areaDesc[cat] == 'string' && adItem.areaDesc[cat].toLowerCase().includes(searchValue.toLowerCase())) {
						searchResults[cat] = getKIC(adItem.areaDesc[cat]);
					} else if (typeof adItem.areaDesc[cat] == 'object') {
						Object.keys(adItem.areaDesc[cat]).forEach(subcat1 => {
							if (typeof adItem.areaDesc[cat][subcat1] == 'string' && adItem.areaDesc[cat][subcat1].toLowerCase().includes(searchValue.toLowerCase())) {
								searchResults[cat] = searchResults[cat] || {};
								searchResults[cat][subcat1] = getKIC(adItem.areaDesc[cat][subcat1]);
							} else if (typeof adItem.areaDesc[cat][subcat1] == 'object') {
								Object.keys(adItem.areaDesc[cat][subcat1]).forEach(subcat2 => {
									if (typeof adItem.areaDesc[cat][subcat1][subcat2] == 'string' && adItem.areaDesc[cat][subcat1][subcat2].toLowerCase().includes(searchValue.toLowerCase())) {
										searchResults[cat] = searchResults[cat] || {};
										searchResults[cat][subcat1] = searchResults[cat][subcat1] || {};
										searchResults[cat][subcat1][subcat2] = getKIC(adItem.areaDesc[cat][subcat1][subcat2]);
									}
								});
							}
						});
					}
				});

				let keywords_in_context = [];
				const adItemWords = adItem.value.split(' ');
				adItemWords.forEach((word,j) => {
					if (word.toLowerCase().includes(searchValue.toLowerCase())) {
						var seq = adItemWords.slice((j-12>0) ? j-12 : 0, (j+11<adItemWords.length-1) ? j+11 : adItemWords.length-1);
						if (j-12 > 0) {
							seq[0] = "... " + seq[0];
						}
						if (j+11<adItemWords.length-1) {
							seq[seq.length-1] += " ...";
						}
						keywords_in_context.push(seq.join(' '));
					}
				});
				return (
					<div 
						onClick={ this.props.onNeighborhoodClick}
						onMouseEnter={ this.props.onNeighborhoodHighlighted }
						onMouseLeave={ this.props.onNeighborhoodUnhighlighted }
						id={ adItem.holcId }
						className={'adSearchResult' + ' grade' + adItem.grade}
					>
						<h4>{adItem.holcId + ((adItem.name) ? ' ' + adItem.name : '')}</h4>
						{ renderForm(searchResults) }
					</div>
				); 
			}}
			filterOption={(inputValue, option) => option.value.toLowerCase().includes(inputValue)}
			//onOptionSelected={ this.onCitySelected }
			//customListComponent={ TypeAheadADSnippet }
			onKeyUp={ this.props.onSearchingADs }
			ref='adSearch'
		/>
		);
	}
}