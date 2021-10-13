const calculateDimensions = () => {
  const dimensions = {
    containerPadding: 20,
    headerHeight: 100,
    mobileHeaderHeight: 35,
    tilesHeight: window.innerHeight - 140, // two paddings + headerHeight
    dataViewerTitleBottomMargin: 10,
    adNavHeight: 20,

    dataViewerWidth: 0,
    mainPaneWidth: 0,
    dataViewerTitleHeight: 0,
  };

  dimensions.windowHeight = window.innerHeight;
  dimensions.windowWidth = window.innerWidth;

  if (dimensions.windowWidth <= 480) {
    dimensions.media = 'phone';
  } else if (dimensions.windowWidth < 900) {
    dimensions.media = 'tablet-portrait';
  } else {
    dimensions.media = 'desktop';
  }

  if (dimensions.media === 'desktop') {
    dimensions.headerWidth = dimensions.windowWidth * 0.65;
    dimensions.headerHeight = 100;
  } else {
    dimensions.headerWidth = dimensions.windowWidth;
    dimensions.headerHeight = 40;
  }

  dimensions.headerStyle = {
    height: dimensions.headerHeight,
  };

  if (dimensions.media === 'desktop') {
    dimensions.mapHeight = dimensions.windowHeight - dimensions.headerHeight;
  } else {
    dimensions.mapHeight = dimensions.windowHeight - dimensions.headerHeight;
  }

  dimensions.mapStyle = {
    height: dimensions.mapHeight,
  };

  if (dimensions.media !== 'mobile') {
    dimensions.dataViewerHeight = dimensions.windowHeight - dimensions.headerHeight - 40;
    dimensions.dataViewerWidth = 500;
  } else {
    dimensions.dataViewerHeight = 'auto';
    dimensions.dataViewerWidth = dimensions.windowWidth;
    dimensions.dataViewerRight = 0;
    dimensions.dataViewerLeft = 0;
    dimensions.dataViewerBottom = 0;
  }

  dimensions.dataViewerStyle = {
    maxHeight: dimensions.dataViewerHeight,
  };

  dimensions.cityStatsButtonStyle = {
    position: 'fixed',
    right: dimensions.dataViewerRight,
    top: dimensions.headerHeight + 20,
    padding: '0 20px',
  };

  dimensions.citySearchStyle = {
    position: 'fixed',
    zIndex: 100,
    height: dimensions.mapStyle.height,
    width: dimensions.dataViewerStyle.width,
    top: 0,
    right: 20,
  };

  dimensions.mapToggleStyle = {
    //left: dimensions.windowWidth / 3 - 100,
  };

  dimensions.selectedNeighborhoodHeaderStyle = {
    position: 'fixed',
    height: 150,
    width: dimensions.dataViewerStyle.width,
    top: dimensions.headerHeight + 20,
    right: 20,
  };

  dimensions.ADTranscriptionStyle = {
    position: 'fixed',
    height: dimensions.dataViewerStyle.height - dimensions.selectedNeighborhoodHeaderStyle.height,
    width: dimensions.dataViewerStyle.width,
    top: dimensions.selectedNeighborhoodHeaderStyle.top + dimensions.selectedNeighborhoodHeaderStyle.height,
    right: 20,
    overflow: 'scroll',
  };

  dimensions.ADImageStyle = {
    position: 'fixed',
    height: dimensions.dataViewerHeight - dimensions.selectedNeighborhoodHeaderStyle.height,
    width: dimensions.dataViewerStyle.width,
    top: dimensions.selectedNeighborhoodHeaderStyle.top + dimensions.selectedNeighborhoodHeaderStyle.height,
    right: 20,
  };

  dimensions.adFullViewWidth = Math.min(400, dimensions.windowWidth / 4);

  dimensions.tilesHeight = dimensions.windowHeight - dimensions.headerHeight - 2 * dimensions.containerPadding;
  dimensions.dataViewerWidth = (dimensions.media !== 'phone') ? Math.max(400, Math.min(700, dimensions.windowWidth / 3)) : dimensions.windowWidth;
  dimensions.mainPaneWidth = (document.getElementsByClassName('main-pane').length > 0) ? document.getElementsByClassName('main-pane')[0].offsetWidth : dimensions.windowWidth * 0.644 - 2*dimensions.containerPadding;
  dimensions.dataViewerTitleHeight = (document.getElementsByClassName('dataViewerTitle').length > 0) ? document.getElementsByClassName('dataViewerTitle')[0].offsetHeight: 30;

  dimensions.dataViewerFullColumnWidth = Math.min(400, dimensions.windowWidth / 4);
  return dimensions;
};

export default calculateDimensions;
