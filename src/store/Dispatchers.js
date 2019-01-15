import TheStore from '.';
import Actions from '../utils/Actions';

export const selectCity = path => (dispatch) => {
  dispatch({
    type: Actions.SELECT_CITY_REQUEST,
  });
  return Promise.all([
    fetch(`./static/cities/${path}`),
    fetch(`./static/citiesSelected/${path}`),
  ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(responsesJSON => dispatch({
      type: Actions.SELECT_CITY_SUCCESS,
      payload: Object.assign(responsesJSON[0], responsesJSON[1]),
    }));
};

const mapAction = zoomAndCenter => ({
  type: Actions.MOVE_MAP,
  payload: zoomAndCenter,
});

const selectGrade = grade => ({
  type: Actions.SELECT_GRADE,
  payload: grade,
});

const selectRingArea = (ring, grade) => {
  return {
    type: Actions.SELECT_RING_GRADE,
    payload: (ring && grade) ? { ring, grade } : null,
  };
};

export const updateMap = zoomAndCenter => TheStore.dispatch(mapAction(zoomAndCenter));
export const citySelected = (eOrId) => {
  let id = eOrId;
  if (typeof eOrId === 'Object' && eOrId.target.id) {
    id = eOrId.target.id;
  }
  return TheStore.dispatch(selectCity(id));
};
export const gradeSelected = e => TheStore.dispatch(selectGrade(e.target.id));
export const gradeUnselected = () => TheStore.dispatch(selectGrade(null));
export const ringAreaSelected = (e) => {
  const [ring, grade] = e.target.id.split('-');
  return TheStore.dispatch(selectRingArea(parseInt(ring, 10), grade));
};
export const ringAreaUnselected = () => TheStore.dispatch(selectRingArea(null, null));
