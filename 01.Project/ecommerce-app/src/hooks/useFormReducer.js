import { useReducer } from "react";

const FORM = {
    CHANGE: "FORM_CHANGE",
    BLUR: "FORM_BLUR",
    SET_ERRORS: "FORM_SET_ERRORS",
    MARK_AS_TOUCHED: "FORM_MARK_AS_TOUCHED",
    SUBMIT_START: "FORM_SUBMIT_START",
    SUBMIT_END: "FORM_SUBMIT_END",
    SET_SUBMIT_ERROR: "FORM_SET_SUBMIT_ERROR",
    RESET: "FORM_RESET",   
}

const setIn = (obj, path, value) => {
  const keys = path.split(".");
  const clone = structuredClone(obj);
  let current = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current = current[keys[i]] = {};
  }
  current[keys[keys.length - 1]] = value;
  return clone;
};

const formReducer = (state, action) => {
  switch (action.type) {
    case FORM.CHANGE:
      return {
        // se clona el estado para no modificar el original
        ...state,
        // se actualiza el valor del campo
        value: {...state.value, [action.field]: action.value},
        // se marca el campo como tocado
        touch: {...state.touch, [action.field]: true},
      };
    case FORM.BLUR:
      return {
        // se clona el estado para no modificar el original
        ...state,
        // se marca el campo como tocado
        touch: {...state.touch, [action.field]: true},
      };
    case FORM.SET_ERRORS:
      return {
        // se clona el estado para no modificar el original
        ...state,
        // se actualizan los errores del campo
        error: {...state.error, ...action.errors},
      };
    case FORM.MARK_AS_TOUCHED:
      return {
        // se clona el estado para no modificar el original
        ...state,
        // se actualiza el touch del campo
        touch: {...state.touch, [action.field]: action.touch},
      };
    case "SET_TOUCHES":
      return {
        // se clona el estado para no modificar el original
        ...state,
        // se actualizan los touches del campo
        touch: {...state.touch, ...action.touches},
      };
    default:
      return state;
  }
};

export default useFormReducer;