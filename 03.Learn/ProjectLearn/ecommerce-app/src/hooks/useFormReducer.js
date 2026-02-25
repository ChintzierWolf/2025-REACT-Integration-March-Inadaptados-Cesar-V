import { useMemo, useReducer } from "react";

const FORM = {
    CHANGE: "FORM_CHANGE",
    BLUR: "FORM_BLUR",
    SET_ERRORS: "FORM_SET_ERRORS",
    MARK_ALL_TOUCHED: "FORM_MARK_ALL_TOUCHED",
    SUBMIT_START: "FORM_SUBMIT_START",
    SET_SUBMIT_ERROR: "FORM_SET_SUBMIT_ERROR",
    SUBMIT_END: "FORM_SUBMIT_END",
    RESET: "FORM_RESET",
}

function setIn( obj, path, value ) {
    const keys = path.split(".");
    const clone = structuredClone(obj);
    let current = clone;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = { ...current[key] };
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return clone;
}

function getIn( obj, path ) {
    const keys = path.split(".").reduce((acc, key) => {
        acc ? acc[key] : undefined;
    }, obj);
    return keys;
}

function formReducer( state, action ) {
    switch (action.type) {
        case FORM.CHANGE:
            const { name, value } = action.payload;
            return {
                ...state,
                values: setIn(state.values, name, value),
            };
        case FORM.BLUR:
            const { path } = action.payload;
            return {
                ...state,
                touched: setIn(state.touched, path, true),
            };
        case FORM.SET_ERRORS:
            const { errors } = action.payload;
            return {
                ...state,
                errors: errors,
            };
        case FORM.MARK_ALL_TOUCHED:
            return {
                ...state,
                touched: action.payload,
            };
        case FORM.SUBMIT_START:
            return {
                ...state,
                isSubmitting: true,
            };
        case FORM.SET_SUBMIT_ERROR:
            const { submitError } = action.payload;
            return {
                ...state,
                submitError: submitError,
            };
        case FORM.SUBMIT_END:
            return {
                ...state,
                isSubmitting: false,
            };
        case FORM.RESET:
            const { initialValues } = action.payload;
            return {
                ...state,
                values: initialValues,
                touched: {},
                errors: {},
                isSubmitting: false,
            };
        default:
            return state;
    }
}

export function useFormReducer( initialValues, validate ) {
    const initialState = useMemo(() => (
        {
            values: initialValues,
            touched: structuredClone(initialValues),
            errors: {},
            isSubmitting: false,
            submitError: "",
        }
    ), [initialValues]);

    const initTouched = (obj) =>
        Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [
                key,
                value && typeof value === "object"
                && !Array.isArray(value)
                    ? initTouched(value)
                    : false,
            ])
        );
    
    const seed = useMemo(
        () => ({
            ...initialState,
            touched: initTouched(initialValues)
        }),
        [initialState, initialValues]
    );

    const [state, dispatch] = useReducer(formReducer, seed);

    const onChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: FORM.CHANGE, payload: { name, value } });
    };

    const onBlur = (e) => {
        const { name } = e.target;
        dispatch({ type: FORM.BLUR, payload: { path: name } });
    };

    const runValidation = () => {
        const errors = validate(state.values);
        dispatch({ type: FORM.SET_ERRORS, payload: { errors } });
        return errors;
    };

    const getFieldError = (name) => getIn(state.errors, name);
    
    const isTouched = (name) => Boolean(getIn(state.touched, name));
    
    const markAllTouched = () => {
        const mark = (obj) =>
            Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [
                    key,
                    value && typeof value === "object"
                    && !Array.isArray(value)
                        ? mark(value)
                        : true,
                ])
            );
        dispatch({ type: FORM.RESET, payload: { ...state, touched: mark(state.values) } });
    };

    return {
        ...state,
        onChange,
        onBlur,
        runValidation,
        getFieldError,
        isTouched,
        markAllTouched,
        setSubmitting: (value) => dispatch({ type: value ? FORM.SUBMIT_START : FORM.SUBMIT_END }),
        setSubmittingError: (msg) => dispatch({ type: FORM.RESET, payload: { ...state, submitError: msg } }),
        reset: () => dispatch({ type: FORM.RESET, payload: seed }),
    };
}
