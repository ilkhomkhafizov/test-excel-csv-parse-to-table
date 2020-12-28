import { request } from './../services/api.service';
import {ADD_COLUMN, 
        DELETE_COLUMN, 
        ADD_ROW, 
        DELETE_ROW, 
        UPDATE_CELL,
        SET_HEADERS,
        SET_BODY,
        SET_TABLE,
        VALIDATE_CELLS,
        PARSE_CELLS,
        LIST_SURVEYS} from "./constants"

export const addColumn = after => ({ type: ADD_COLUMN, after });
export const deleteColumn = column => ({ type: DELETE_COLUMN, column });
export const addRow = after => ({ type: ADD_ROW, after });
export const deleteRow = row => ({ type: DELETE_ROW, row });
export const updateCell = (row, column, value) => ({
  type: UPDATE_CELL,
  row,
  column,
  value
});
export const setHeaders = headers => ({ type: SET_HEADERS, headers });
export const setBody = body => ({ type: SET_BODY, body });
export const setTable = rows => dispatch => {
  dispatch({ type: SET_TABLE, rows });
};
export const validateCells = () => ({ type: VALIDATE_CELLS });
export const parseCells = () => ({ type: PARSE_CELLS });

export const listSurveys = () => dispatch => {
  return request(LIST_SURVEYS).then(({ response }) =>
    dispatch({ type: LIST_SURVEYS, surveys: response })
  );
};

export const createPatientsAndSendSurveys = () => dispatch => {
  return dispatch(validateCells());
};

export const initialiseTable = () => dispatch => {
  return request(LIST_SURVEYS)
    .then(({ response }) => dispatch({ type: LIST_SURVEYS, surveys: response }))
    .then(() => dispatch(addRow()));
};

export const getNewCell = ({ value = "", readOnly = null, type = "text" } = {}) => {
  const cell = {
    id: Math.random(),
    type,
    value,
    readOnly: false
  };

  if (readOnly !== null) {
    cell.readOnly = readOnly;
  }
  return cell;
};

