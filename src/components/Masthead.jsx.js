import * as React from 'react';
import PropTypes from 'prop-types';

const Masthead = (props) => {
	return (
		<header style={props.style}>
			<h1>
				<span className='header-main'>Mapping Inequality</span>
				<span className='header-sub'>Redlining in New Deal America</span>
			</h1>
			<h4 onClick={props.onModalClick} id='intro'>Introduction</h4>
			<h4 onClick={props.onModalClick} id='bibliograph'>Bibliographic Note & Bibliography</h4>
			<h4 onClick={props.onModalClick} id='about'>About</h4>
			<h4 onClick={props.onContactUsToggle}>Contact Us</h4>
			<hr className='style-eight' />
		</header>
	);
};

export default Masthead;

Masthead.propTypes = {
	onModalClick: PropTypes.func.isRequired,
	onContactUsToggle: PropTypes.func.isRequired,
	style: PropTypes.object.isRequired
};
