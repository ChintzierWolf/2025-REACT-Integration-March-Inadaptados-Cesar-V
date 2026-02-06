export const validateAddress = (values) => {
    const errors = {
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: "",
    addressType: "", // home 
    };

    if (!values.name.trim() || 
        values.name.trim().length < 4) 
        errors.name = "Escribe un nombre de al menos 4 caracteres";
    
    if (!values.address.trim()) 
        errors.address = "Escribe una dirección";
    
    if (!values.city.trim()) 
        errors.city = "Escribe una ciudad";
    
    if (!values.state.trim()) 
        errors.state = "Escribe un estado";
    
    if (!values.postalCode.trim() ||
        values.postalCode.trim() ||
        values.postalCode.trim().length < 4 ||
        values.postalCode.trim().length > 6) 
        errors.postalCode = "Escribe un código postal válido de 4 a 6 dígitos";
    
    if (!values.country.trim()) 
        errors.country = "Escribe un país";
    
    if (!values.phone.trim() ||
        values.phone.trim().length !== 10) 
        errors.phone = "Escribe un número de teléfono válido de 10 dígitos";
    
    if (!values.addressType.trim() || 
        values.addressType.trim() !== "home" || 
        values.addressType.trim() !== "work" || 
        values.addressType.trim() !== "other") 
        errors.addressType = "Debes seleccionar un nombre para la dirección válido (casa, trabajo, otro)";
    
    return errors;
}