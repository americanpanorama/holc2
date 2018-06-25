import { EventEmitter } from 'events';
import AppDispatcher from '../utils/AppDispatcher';
import { AppActionTypes } from '../utils/AppActionCreator';

const DimensionsStore = {

	data: {
		containerPadding: 20,
		headerHeight: 100,
		mobileHeaderHeight: 35,
		tilesHeight: window.innerHeight - 140, // two paddings + headerHeight
		sidebarTitleBottomMargin: 10,
		adNavHeight: 20,

		sidebarWidth: 0,
		mainPaneWidth: 0,
		sidebarTitleHeight: 0
	},

	computeComponentDimensions () {
		this.data.windowHeight = window.innerHeight;
		this.data.windowWidth = window.innerWidth;
		this.data.tilesHeight = this.data.windowHeight - this.data.headerHeight - 2*this.data.containerPadding;
		this.data.sidebarWidth =(document.getElementsByClassName('dataViewer').length > 0) ? document.getElementsByClassName('dataViewer')[0].offsetWidth : this.data.windowWidth * 0.322 - 2*this.data.containerPadding;
		this.data.mainPaneWidth = (document.getElementsByClassName('main-pane').length > 0) ? document.getElementsByClassName('main-pane')[0].offsetWidth : this.data.windowWidth * 0.644 - 2*this.data.containerPadding;
		this.data.sidebarTitleHeight = (document.getElementsByClassName('sidebarTitle').length > 0) ? document.getElementsByClassName('sidebarTitle')[0].offsetHeight: 30;

		if (this.data.windowWidth <= 480) {
			this.data.size = 'mobile';
		} else if (this.data.windowWidth <= 800) {
			this.data.size = 'tablet';
		} else {
			this.data.size = 'desktop';
		}

		this.data.mobileSidebarHeight = 150;

		this.emit(AppActionTypes.storeChanged);
	},

	setMobileSidebarHeight: function(height) {
		this.data.mobileSidebarHeight = height;
		this.emit(AppActionTypes.storeChanged);
	},

	isMobile() { return this.data.windowWidth <= 750; },

	getDimensions () {
		return this.data;
	},

	getMainPaneStyle: function() {
		return { height: (this.isMobile()) ? (this.data.windowHeight - this.data.mobileHeaderHeight) + 'px' : this.data.tilesHeight + 'px' };
	},

	getSidebarHeightStyle: function() {
		// same as the main panel style as it's just the height
		return this.getMainPaneStyle();
	},

	getADViewerStyle: function() {
		return {
			height: (this.data.tilesHeight - this.data.containerPadding * 2) + 'px',
			width: (this.data.mainPaneWidth - this.data.containerPadding * 2) + 'px'
		}
	},

	// this needs to be redone

	getSearchStyle: function() {
		return {
			width: (this.data.windowWidth * 0.3233333 - this.data.windowWidth * 0.0075) + 'px',
			height: (this.data.windowHeight - 2 * this.data.containerPadding) + 'px'
		}
	},

	getADNavPreviousStyle: function() {
		return {
			width: this.data.tilesHeight + 'px',
			top: ((this.data.tilesHeight + this.data.containerPadding) / 2 + this.data.headerHeight) + 'px',
			right: (this.data.containerPadding * 1.5 - this.data.tilesHeight / 2 + this.data.sidebarWidth - this.data.adNavHeight) + 'px'
		}
	},

	getADNavNextStyle: function() {
		return {
			width: this.data.tilesHeight + 'px',
			top: ((this.data.tilesHeight + this.data.containerPadding) / 2 + this.data.headerHeight) + 'px',
			right: (this.data.containerPadding * 1.5 - this.data.tilesHeight / 2) + 'px'
		}
	},

	getSidebarMapStyle: function() {
		return {
			width: (this.data.sidebarWidth - 2*this.data.adNavHeight) + 'px',
			height: (this.data.tilesHeight - this.data.sidebarTitleHeight - this.data.sidebarTitleBottomMargin - 2*this.data.containerPadding) + 'px',

		}
	}


}

// Mixin EventEmitter functionality
Object.assign(DimensionsStore, EventEmitter.prototype);

// Register callback to handle all updates
DimensionsStore.dispatchToken = AppDispatcher.register((action) => {

	switch (action.type) {
		case AppActionTypes.loadInitialData:
		case AppActionTypes.mapInitialized:
		case AppActionTypes.windowResized:
			DimensionsStore.computeComponentDimensions();
			break;

		case AppActionTypes.mobileSidebarResized:
			DimensionsStore.setMobileSidebarHeight(action.height);
			break;
	}


});

export default DimensionsStore;