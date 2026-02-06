import { useMemo, useReducer } from "react";

const FORM = {
  // Acciones del formulario
  CHANGE: "FORM_CHANGE",
  // Acciones del formulario
  BLUR: "FORM_BLUR",
  // Acciones del formulario
  SET_ERRORS: "FORM_SET_ERRORS",
  // Acciones del formulario
  MARK_TOUCHED: "FORM_MARK_TOUCHED",
  // Acciones del formulario
  SUBMIT_START: "FORM_SUBMIT_START",
  // Acciones del formulario
  SUBMIT_END: "FORM_SUBMIT_END",
  SET_SUBMIT_ERROR: "FORM_SET_SUBMIT_ERROR",
  RESET: "FORM_RESET",
};

function setIn(obj, path, value) {
  // setIn es una funcion que recibe un objeto, una ruta y un valor y retorna un objeto con el valor establecido en la ruta
  const keys = path.split(".");
  // keys es un array con las claves de la ruta
  const clone = structuredClone(obj);
  // clone es una copia del objeto
  let cur = clone;
  // cur es el objeto actual
  for (let i = 0; i < keys.length - 1; i++) {
    // i es el indice del array
    if (!cur[keys[i]]) cur[keys[i]] = {};
    // Si no existe la clave, se crea
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return clone;
}

function getIn(obj, path) {
  return path.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

function formReducer(state, action) {
  switch (action.type) {
    case FORM.CHANGE: {
      const { name, value } = action.payload;
      return { ...state, values: setIn(state.values, name, value) };
    }
    case FORM.BLUR: {
      const { name } = action.payload;
      return { ...state, touched: setIn(state.touched, name, true) };
    }
    case FORM.SET_ERRORS:
      return { ...state, errors: action.payload };
    case FORM.MARK_TOUCHED:
      return { ...state, touched: action.payload };
    case FORM.SUBMIT_START:
      return { ...state, isSubmitting: true, submitError: "" };
    case FORM.SUBMIT_END:
      return { ...state, isSubmitting: false };
    case FORM.RESET:
      return action.payload;
    case FORM.SET_SUBMIT_ERROR:
      return { ...state, submitError: action.payload };
    default:
      return state;
  }
}

export function useFormReducer({ initialValues, validate }) {
  const initialState = useMemo(
    () => ({
      values: initialValues,
      touched: structuredClone(initialValues),
      errors: {},
      isSubmitting: false,
      submitError: "",
    }),
    [initialValues],
  );

  const initTouched = (obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v && typeof v === "object" && !Array.isArray(v)
          ? initTouched(v)
          : false,
      ]),
    );

  const seed = useMemo(
    () => ({ ...initialState, touched: initTouched(initialValues) }),
    [initialState, initialValues],
  );

  const [state, dispatch] = useReducer(formReducer, seed);

  const onChange = (e) => {
    // El evento onChange se dispara cuando el usuario escribe en el input
    // e.target es el elemento que dispara el evento
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    dispatch({ type: FORM.CHANGE, payload: { name, value: finalValue } });
  };

  const onBlur = (e) => {
    // El evento onBlur se dispara cuando el usuario sale del input
    // e.target es el elemento que dispara el evento
    const { name } = e.target;
    dispatch({ type: FORM.BLUR, payload: { name } });
  };

  const runValidation = () => {
    // validate es una funcion que recibe los valores del formulario y retorna un objeto con los errores
    const errors = validate(state.values);
    // dispatch es una funcion que dispara acciones al reducer
    dispatch({ type: FORM.SET_ERRORS, payload: errors });
    // retorna los errores
    return errors;
  };

  const getFieldError = (name) => getIn(state.errors, name);
  // getIn es una funcion que recibe un objeto y una ruta y retorna el valor de la ruta

  const isTouched = (name) => Boolean(getIn(state.touched, name));
  // isTouched es una funcion que recibe un nombre y retorna true si el campo ha sido tocado

  const markAllTouched = () => {
    // Cuando se validan todos los campos se marcan como tocados
    // mark es una funcion que recibe un objeto y retorna un objeto con todos los campos marcados como tocados
    const mark = (obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k,
          // Si el valor es un objeto y no es un array, se llama a mark de forma recursiva
          v && typeof v === "object" && !Array.isArray(v) ? mark(v) : true,
        ]),
      );
    // dispatch es una funcion que dispara acciones al reducer
    dispatch({ type: FORM.MARK_TOUCHED, payload: mark(state.touched) });
  };

  const handleSubmit = async (onSubmit) => {
    // markAllTouched es una funcion que marca todos los campos como tocados
    markAllTouched();
    const errors = runValidation();
    // Si no hay errores se dispara el submit
    if (Object.keys(errors).length === 0) {
      // dispatch es una funcion que dispara acciones al reducer
      // El dispatch realiza la accion de SUBMIT_START
      // El reducer es el que contendrá la logica de la accion
      // El reducer en este caso está obligado a avisar que el submit ha comenzado
      dispatch({ type: FORM.SUBMIT_START });
      try {
        await onSubmit(state.values);
        dispatch({ type: FORM.SUBMIT_END });
      } catch (error) {
        dispatch({ type: FORM.SET_SUBMIT_ERROR, payload: error.message });
        dispatch({ type: FORM.SUBMIT_END });
      }
    }
  };

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    onChange,
    onBlur,
    runValidation,
    getFieldError,
    isTouched,
    markAllTouched,
    handleSubmit,
    setSubmitting: (v) =>
      dispatch({ type: v ? FORM.SUBMIT_START : FORM.SUBMIT_END }),
    setSubmitError: (msg) =>
      dispatch({ type: FORM.SET_SUBMIT_ERROR, payload: msg }),
    reset: () => dispatch({ type: FORM.RESET, payload: seed }),
  };
}
