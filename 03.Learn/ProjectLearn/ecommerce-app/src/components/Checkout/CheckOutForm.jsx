import FormField from "../common/FormField/FormField";
import { useFormReducer } from "../../hooks/useFormReducer";
import { checkoutInitialValues, hasError } from "../../forms/CheckoutModel";
import { validateCheckout } from "../../forms/checkoutValidate";
import "./CheckOutForm.css";

export default function CheckOutForm() {
    const form = useFormReducer({
        initialValues: checkoutInitialValues,
        validate: validateCheckout,
    });
    
    const fields = [
        {
            id: "name",
            label: "Name",
            name: "contact.name",
            autoComplete: "name",
            type: "text",
            placeholder: "Enter your name",
        },
        {
            id: "email",
            label: "Email",
            name: "contact.email",
            autoComplete: "email",
            type: "email",
            placeholder: "Enter your email",
        },
        {
            id: "phone",
            label: "Phone",
            name: "contact.phone",
            autoComplete: "phone",
            type: "tel",
            placeholder: "Enter your phone",
        },
        {
            id: "address",
            label: "Address",
            name: "contact.address",
            autoComplete: "address",
            type: "text",
            placeholder: "Enter your address",
        },
        {
            id: "city",
            label: "City",
            name: "contact.city",
            autoComplete: "city",
            type: "text",
            placeholder: "Enter your city",
        },
        {
            id: "state",
            label: "State",
            name: "contact.state",
            autoComplete: "state",
            type: "text",
            placeholder: "Enter your state",
        },
        {
            id: "zip",
            label: "Zip",
            name: "contact.zip",
            autoComplete: "zip",
            type: "text",
            placeholder: "Enter your zip",
        },
        {
            id: "country",
            label: "Country",
            name: "contact.country",
            autoComplete: "country",
            type: "text",
            placeholder: "Enter your country",
        },
        {
            id: "paymentMethod",
            label: "Payment Method",
            name: "payment.paymentMethod",
            autoComplete: "paymentMethod",
            type: "text",
            placeholder: "Enter your payment method",
        },
        {
            id: "cardNumber",
            label: "Card Number",
            name: "payment.cardNumber",
            autoComplete: "cardNumber",
            type: "text",
            placeholder: "Enter your card number",
        },
        {
            id: "cardName",
            label: "Card Name",
            name: "payment.cardName",
            autoComplete: "cardName",
            type: "text",
            placeholder: "Enter your card name",
        },
        {
            id: "cardExpiration",
            label: "Card Expiration",
            name: "payment.cardExpiration",
            autoComplete: "cardExpiration",
            type: "text",
            placeholder: "Enter your card expiration",
        },
        {
            id: "cardCvv",
            label: "Card CVV",
            name: "payment.cardCvv",
            autoComplete: "cardCvv",
            type: "text",
            placeholder: "Enter your card cvv",
        },
        {
            id: "notes",
            label: "Notes",
            name: "notes",
            autoComplete: "notes",
            type: "text",
            placeholder: "Enter your notes",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = form.runValidation();
        if (hasError(errors)) {
            form.markAllTouched();
            return;
        }
        try {
            form.setSubmitting(true);
            await onSubmitOrder(form.values);
            form.reset();
        } catch (error) {
            form.setSubmittingError("No se pudo completar el pedido. Intente nuevamente.");
        }
        finally {
            form.setSubmitting(false);
        }
    };

    return (
        <form className="checkoutForm" onSubmit={handleSubmit} noValidate>
            {fields.slice(0, 3).map((field) => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    name={field.name}
                    value={form.values[field.name]}
                    onChange={form.onChange}
                    onBlur={form.onBlur}
                    error={form.getFieldError(field.name)}
                    showError={form.isTouched(field.name)}
                    autoComplete={field.autoComplete}
                    type={field.type}
                    placeholder={field.placeholder}
                />
            ))}
            <h2>Envío</h2>
            {fields.slice(3, 6).map((field) => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    name={field.name}
                    value={form.values[field.name]}
                    onChange={form.onChange}
                    onBlur={form.onBlur}
                    error={form.getFieldError(field.name)}
                    showError={form.isTouched(field.name)}
                    autoComplete={field.autoComplete}
                    type={field.type}
                    placeholder={field.placeholder}
                />
            ))}
            <h2>Pago</h2>
            {fields.slice(6, 10).map((field) => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    name={field.name}
                    value={form.values[field.name]}
                    onChange={form.onChange}
                    onBlur={form.onBlur}
                    error={form.getFieldError(field.name)}
                    showError={form.isTouched(field.name)}
                    autoComplete={field.autoComplete}
                    type={field.type}
                    placeholder={field.placeholder}
                />
            ))}

            <h2>Notas</h2>
            {fields.slice(10).map((field) => (
                <FormField
                    key={field.id}
                    id={field.id}
                    label={field.label}
                    name={field.name}
                    value={form.values[field.name]}
                    onChange={form.onChange}
                    onBlur={form.onBlur}
                    error={form.getFieldError(field.name)}
                    showError={form.isTouched(field.name)}
                    autoComplete={field.autoComplete}
                    type={field.type}
                    placeholder={field.placeholder}
                />
            ))}

            {form.submitError ? (
                <p className="submitError">{form.submitError}</p>
            ) : null}

            <button className="submitButton" type="submit" disabled={form.isSubmitting}>
                {form.isSubmitting ? "Enviando..." : "Procesando pedido"}
            </button>
        </form>
    );

    function getValue (obj, path) {
        return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
    }
}