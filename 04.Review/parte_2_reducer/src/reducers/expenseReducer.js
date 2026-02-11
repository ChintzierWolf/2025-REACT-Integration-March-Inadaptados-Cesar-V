export const initialState = {
  budget: 0,
  budgetSet: false,
  expenses: [],
};

export const expenseReducer = (state, action) => {
  switch (action.type) {
    case "SET_BUDGET":
      return {
        ...state,
        budget: action.payload,
        budgetSet: true,
      };
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case "RESET":
      return {
        budget: 0,
        budgetSet: false,
        expenses: [],
      };
    default: 
      return state;
  }
};
