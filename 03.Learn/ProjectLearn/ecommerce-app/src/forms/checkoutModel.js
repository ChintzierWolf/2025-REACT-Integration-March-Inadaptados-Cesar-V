export const checkoutInitialValues = {
    contact:{
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    },
    shipping:{
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    },
    payment:{
        method: "card", // "card" | "paypal" | "bitcoin" | "cash" | "bank" | "giftCard" | "crypto" | "wireTransfer" | "check" | "moneyOrder" | "other" 
        cardNumber: "",
        cardName: "",
        cardExpiry: "",
        cardCVV: "",
    },
    notes: "",
    };

    export function hasErrors(errors){
        const walk = (obj) => {
            for (const key in obj) {
                if (obj[key] && typeof obj[key] === "object") {
                    if (walk(obj[key])) return true;
                } else {
                    if (obj[key]) return true;
                }
            }
            return false;
        }
        return walk(errors);
    };

    // Cada uno de estos campos son para organizar el modelo de datos
    // Y que sea más fácil de manejar y organizar
    // Y que el front end se va a comunicar con el back end para enviar los datos del formulario y que se aseguré de que los datos sean correctos y seguros.