export function validateCheckout(values) {

    const isEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    // En este archivo se va a validar que los datos o valores del formulario de checkoutModels sean correctos y seguros.
    // Una vez que se definieron los errores, se va buscar retornar uno o más valores de error para cada campo del formulario.
    const errors = {
        contact: {},
        shipping: {},
        payment: {},
        notes: ""
    };

    // Contact

    // EN los mensajes de error se busca ser claro y consciso para la experiencia del usuario.
    // Se busca que el usuario sepa que campo debe llenar y por que debe llenarlo.
    if (!values.contact.firstName.trim()) {
        errors.contact.firstName = "First name is required";
    }
    if (!values.contact.lastName.trim()) {
        errors.contact.lastName = "Last name is required";
    }
    if (!isEmail(values.contact.email)) {
        errors.contact.email = "Email is invalid";
    }
    if (!values.contact.phone) {
        errors.contact.phone = "Phone is invalid";
    }

    // Shipping
    if (!values.shipping.address1) {
        errors.shipping.address1 = "Address 1 is required";
    }
    if (!values.shipping.address2) {
        errors.shipping.address2 = "Address 2 is required";
    }
    if (!values.shipping.city) {
        errors.shipping.city = "City is required";
    }
    if (!values.shipping.state) {
        errors.shipping.state = "State is required";
    }
    if (!values.shipping.zip) {
        errors.shipping.zip = "Zip is required";
    }
    if (!values.shipping.country) {
        errors.shipping.country = "Country is required";
    }

    // Payment
    if (!values.payment.method) {
        errors.payment.method = "Method is required";
    }
    if (!values.payment.cardNumber) {
        errors.payment.cardNumber = "Card number is required";
    }
    if (!values.payment.cardName) {
        errors.payment.cardName = "Card name is required";
    }
    if (!values.payment.cardExpiry) {
        errors.payment.cardExpiry = "Card expiry is required";
    }
    if (!values.payment.cardCVV) {
        errors.payment.cardCVV = "Card CVV is required";
    }

    // Notes
    if (!values.notes) {
        errors.notes = "Notes is required";
    }
    return errors;
}   
