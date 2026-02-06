export const addressInitialValues = {
    name: "",
    address1: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    reference: "",
    default: Boolean,
}

export const hasErrors = (errors) => {
    const walk = (obj) =>
      Object.values(obj).some((v) => v && typeof v === "object" ? walk(v) : Boolean(v));
    return walk(errors);
}

// export const hasErrors = (errors) => Object.keys(errors).length > 0;