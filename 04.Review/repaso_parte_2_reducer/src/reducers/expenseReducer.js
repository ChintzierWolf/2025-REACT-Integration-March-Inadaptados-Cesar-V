export const initialState = {
    budget: 0,
    budgetSet: false,
    expenses: []
}

// Dependiendo de la accion que se reciba, se va a ejecutar una funcion
// y se va a retornar un nuevo estado dentro de expenseReducer
// el state es inmutable, no se puede cambiar directamente, se debe usar setState para cambiarlo
// y si se quiere cambiar el estado de un objeto, se debe crear un nuevo objeto con los cambios

export const expenseReducer = (state, action) => {
    // action es un objeto que contiene la informacion que se necesita para cambiar el estado
    // action.type es el tipo de accion que se va a ejecutar
    // action.payload es la informacion que se necesita para cambiar el estado

    // el switch es para que dependiendo de la accion que se reciba, se va a ejecutar una funcion
    switch (action.type) {
        case 'SET_BUDGET':
            return { 
                ...state, 
                // se utiliza el spread operator para copiar el estado actual
                // y se actualiza el valor de budget y budgetSet
                budget: action.payload, 
                budgetSet: true 
            }
        case 'ADD_EXPENSE':
            return { 
                ...state, 
                expenses: [...state.expenses, action.payload] 
                // Si pondríamos reset dentro de la funcion, se resetearía el estado
                // y no se podría agregar un gasto
            }
        case 'RESET_EXPENSE':
            return {
                budget: 0,
                budgetSet: false,
                expenses: []
            }
        case 'DELETE_EXPENSE':
            return {
                ...state, 
                expenses: state.expenses.filter(expense => expense.id !== action.payload) 
            }
        default:
            return state;
    }
}