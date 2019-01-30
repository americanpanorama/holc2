const calculateDimensions = () => {
  const dimensions = {
    containerPadding: 20,
    headerHeight: 100,
    mobileHeaderHeight: 35,
    tilesHeight: window.innerHeight - 140, // two paddings + headerHeight
    sidebarTitleBottomMargin: 10,
    adNavHeight: 20,

    sidebarWidth: 0,
    mainPaneWidth: 0,
    sidebarTitleHeight: 0,
  }

  dimensions.windowHeight = window.innerHeight;
  dimensions.windowWidth = window.innerWidth;

  if (dimensions.windowWidth <= 480) {
    dimensions.size = 'mobile';
  } else if (dimensions.windowWidth <= 800) {
    dimensions.size = 'tablet';
  } else {
    dimensions.size = 'desktop';
  }

  if (dimensions.size === 'desktop' || dimensions.size === 'tablet') {
    dimensions.headerWidth = dimensions.windowWidth * 0.65;
    dimensions.headerHeight = 100;
  } else {
    dimensions.headerWidth = dimensions.windowWidth;
    dimensions.headerHeight = 40;
  }

  dimensions.headerStyle = {
    //width: dimensions.headerWidth,
    height: dimensions.headerHeight,
  };

  if (dimensions.size === 'desktop' || dimensions.size === 'tablet') {
    dimensions.mapHeight = dimensions.windowHeight - dimensions.headerHeight;
  } else {
    dimensions.mapHeight = dimensions.windowHeight - dimensions.headerHeight;
  }

  dimensions.mapStyle = {
    height: dimensions.mapHeight,
  };

  if (dimensions.size === 'desktop' || dimensions.size === 'tablet') {
    dimensions.sidebarHeight = dimensions.windowHeight - dimensions.headerHeight - 40;
    dimensions.sidebarWidth = 500;
  } else {
    dimensions.sidebarHeight = 100;
    dimensions.sidebarWidth = 500;
    dimensions.sidebarRight = 0;
    dimensions.sidebarLeft = 0;
    dimensions.sidebarBottom = 0;
  }

  dimensions.sidebarStyle = {
    maxHeight: dimensions.sidebarHeight,
    width: dimensions.sidebarWidth,
    left: dimensions.sidebarRight,
    top: dimensions.headerHeight + dimensions.containerPadding,
    right: dimensions.sidebarLeft || 'auto',
  };

  dimensions.cityStatsButtonStyle = {
    position: 'fixed',
    right: dimensions.sidebarRight,
    top: dimensions.headerHeight + 20,
    padding: '0 20px',
  };

  dimensions.citySearchStyle = {
    position: 'fixed',
    zIndex: 100,
    height: dimensions.mapStyle.height,
    width: dimensions.sidebarStyle.width,
    top: 0,
    right: 20,
  };

  dimensions.mapToggleStyle = {
    //left: dimensions.windowWidth / 3 - 100,
  };

  dimensions.selectedNeighborhoodHeaderStyle = {
    position: 'fixed',
    height: 150,
    width: dimensions.sidebarStyle.width,
    top: dimensions.headerHeight + 20,
    right: 20,
  };

  dimensions.ADTranscriptionStyle = {
    position: 'fixed',
    height: dimensions.sidebarStyle.height - dimensions.selectedNeighborhoodHeaderStyle.height,
    width: dimensions.sidebarStyle.width,
    top: dimensions.selectedNeighborhoodHeaderStyle.top + dimensions.selectedNeighborhoodHeaderStyle.height,
    right: 20,
    overflow: 'scroll',
  };

  dimensions.ADImageStyle = {
    position: 'fixed',
    height: dimensions.sidebarHeight - dimensions.selectedNeighborhoodHeaderStyle.height,
    width: dimensions.sidebarStyle.width,
    top: dimensions.selectedNeighborhoodHeaderStyle.top + dimensions.selectedNeighborhoodHeaderStyle.height,
    right: 20,
  };

  dimensions.tilesHeight = dimensions.windowHeight - dimensions.headerHeight - 2*dimensions.containerPadding;
  dimensions.sidebarWidth =(document.getElementsByClassName('dataViewer').length > 0) ? document.getElementsByClassName('dataViewer')[0].offsetWidth : dimensions.windowWidth * 0.322 - 2*dimensions.containerPadding;
  dimensions.mainPaneWidth = (document.getElementsByClassName('main-pane').length > 0) ? document.getElementsByClassName('main-pane')[0].offsetWidth : dimensions.windowWidth * 0.644 - 2*dimensions.containerPadding;
  dimensions.sidebarTitleHeight = (document.getElementsByClassName('sidebarTitle').length > 0) ? document.getElementsByClassName('sidebarTitle')[0].offsetHeight: 30;

  return dimensions;
};

export default calculateDimensions;
