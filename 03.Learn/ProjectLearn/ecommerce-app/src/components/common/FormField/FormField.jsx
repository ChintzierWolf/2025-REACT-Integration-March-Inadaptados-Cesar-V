import "/.FormField.css";

export default function FormField({ 
    id,
    label, 
    name, 
    value,
    type = "text",
    placeholder = "",
    onChange, 
    onBlur, 
    error,
    showError,
    autoComplete, 
})

{
    const errorId = `${id}-error`;
    const invalid = Boolean(error && showError);
}
{
    return (
        <div className="formField">
            <label className="formLabel" htmlFor={id}>{label}</label>
            
            <input 
                id={id}
                className= { "formInput" + (invalid ? " formInputError" : "")}
                name={name}
                value={value} 
                type={type} 
                placeholder={placeholder}
                onChange={onChange} 
                onBlur={onBlur} 
                autoComplete={autoComplete}
                aria-invalid={invalid}
                aria-describedby={invalid ? errorId : undefined}
            />

            {invalid ? (
                <p id={errorId} className="formError">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
