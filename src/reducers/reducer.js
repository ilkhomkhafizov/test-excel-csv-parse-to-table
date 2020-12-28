import {
    ADD_COLUMN, 
    DELETE_COLUMN, 
    ADD_ROW, 
    DELETE_ROW, 
    UPDATE_CELL,
    SET_TABLE,
    VALIDATE_CELLS,
    PARSE_CELLS,
    LIST_SURVEYS
} from "../actions/constants"

import {getNewCell} from "../actions/actions"

const initialState = {
    headers: [],
    rows: [],
    surveys: []
};


// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
    switch (action.type) {
      case ADD_COLUMN:
        const { after } = action;
        const newHeader = getNewCell();
        // add new header cell to existing header row
        const headersLeft = [...state.headers].slice(0, after + 1);
        const headersRight = [...state.headers].slice(after + 1);
        const headers = [...headersLeft, newHeader, ...headersRight];
        // add new column to existing rows
        const rows = state.rows.map(row => {
          const newRowCell = getNewCell();
          const left = [...row].slice(0, after + 1);
          const right = [...row].slice(after + 1);
          const newRow = [...left, newRowCell, ...right];
          return newRow;
        });
  
        return { ...state, headers, rows };
      case DELETE_COLUMN: {
        const { column = 0 } = action;
        const headersLeft = [...state.headers].slice(0, column);
        const headersRight = [...state.headers].slice(column + 1);
        const headers = [...headersLeft, ...headersRight];
  
        const rows = state.rows.map(row => {
          const cellsLeft = [...row].slice(0, column);
          const cellsRight = [...row].slice(column + 1);
          return [...cellsLeft, ...cellsRight];
        });
  
        return {
          ...state,
          headers,
          rows
        };
      }
      case ADD_ROW: {
        const { after = 0 } = action;
        const newColumns = state.headers.map(h => {
          const isSurvey = h.value === "Survey";
          const type = isSurvey ? "survey" : "text";
          const value =
            isSurvey && state.surveys.length === 1 ? state.surveys[0].name : "";
          return getNewCell({ type, value });
        });
        const newRow = [newColumns];
        const rowsBefore = [...state.rows].slice(0, after);
        const rowsAfter = [...state.rows].slice(after);
        const rows = [...rowsBefore, ...newRow, ...rowsAfter];
        return { ...state, rows };
      }
      case DELETE_ROW: {
        const { row } = action;
        const rowsBefore = [...state.rows].slice(0, row);
        const rowsAfter = [...state.rows].slice(row + 1);
        return { ...state, rows: [...rowsBefore, ...rowsAfter] };
      }
      case UPDATE_CELL: {
        const { row, column, value } = action;
  
        // update cell
        if (typeof row !== "undefined") {
          const rows = JSON.parse(JSON.stringify(state.rows));
          rows[row][column].value = value;
          // const rows = state.rows.map((r, i) => {
          //   return r.map((cell, j) => {
          //     if (i === row && j === column) {
          //       cell.value = value;
          //     }
          //     return cell;
          //   });
          // });
          return { ...state, rows };
        }
  
        // update header
        const headers = state.headers.map((h, i) => {
          if (i === column) {
            h.value = value;
          }
          return h;
        });
        return { ...state, headers };
      }
      case SET_TABLE: {
        const { rows } = action;
        const headers = rows[0];
        const body = rows.slice(1);
        // set headers
        const newHeaders = headers.map((h, i) => getNewCell({ value: h }));
        // add First Name column if not present
        const hasFirstNameColumn = newHeaders.find(e => e.value === "First Name");
        // if (!hasFirstNameColumn) {
        //   newHeaders.push(getNewCell({ value: "First Name", readOnly: true }));
        // }
        // add Mobile column if not present
        const hasMobileColumn = newHeaders.find(e => e.value === "Mobile");
        // if (!hasMobileColumn) {
        //   newHeaders.push(getNewCell({ value: "Mobile", readOnly: true }));
        // }
        // add Survey column if not present
        const hasSurveyColumn = newHeaders.find(e => e.value === "Survey");
        // if (!hasSurveyColumn) {
        //   newHeaders.push(getNewCell({ value: "Survey", readOnly: true }));
        // }
        // // set body
        const newRows = body.map(row => {
          const { surveys } = state;
          const tmp = [];
          for (let i = 0; i < newHeaders.length; i++) {
            const isSurvey = newHeaders[i].value === "Survey";
            const type = isSurvey ? "survey" : "text";
            const value = row[i] || (surveys.length ? surveys[0].name : "");
            tmp.push(getNewCell({ type, value }));
          }
          return tmp;
        });
  
        return { ...state, headers: newHeaders, rows: newRows };
      }
      case VALIDATE_CELLS: {
        const { headers, rows } = state;
        const newRows = rows.map(row => {
          return row.map((cell, i) => {
            if (headers[i].validate) {
              const isValid = headers[i].validate(cell.value);
              const updatedCell = { ...cell };
              updatedCell.errors = isValid ? [] : ["Number not valid"];
              return updatedCell;
            }
            return cell;
          });
        });
        return { ...state, rows: newRows };
      }
      case PARSE_CELLS: {
        const { headers, rows } = state;
        const newRows = rows.map(row => {
          return row.map((cell, i) => {
            if (
              headers[i].parse &&
              Array.isArray(cell.errors) &&
              cell.errors.length === 0
            ) {
              const updatedCell = JSON.parse(JSON.stringify(cell));
              updatedCell.value = headers[i].parse(updatedCell.value);
              return updatedCell;
            }
            return cell;
          });
        });
        return { ...state, rows: newRows };
      }
      // case CREATE_PATIENTS_AND_SEND_SURVEYS: {
  
      // }
      case LIST_SURVEYS: {
        return { ...state, surveys: action.surveys };
      }
      default:
        return state;
    }
  };
  