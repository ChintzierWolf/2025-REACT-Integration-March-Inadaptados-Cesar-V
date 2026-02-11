import { use, useReducer, useState } from "react";
import "./App.css";
import { expenseReducer, initialState } from "./reducers/expenseReducer";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const [budgetInput, setBudgetInput] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const handleSetBudget = (e) => {
    e.preventDefault();
    const budget = parseFloat(budgetInput);

    if (budget > 0) {
      dispatch({ type: "SET_BUDGET", payload: budget });
      setBudgetInput("");
    }
  };

  const handleAddExpense = (e) => {
  
    e.preventDefault();

   const expense = parseFloat(expenseAmount);
 
    if (expense > 0 && expenseName.trim() !== "") {
      dispatch({
        type: "ADD_EXPENSE",
        payload: { name: expenseName, amount: expense, id: Date.now() },
      });
    }
    setExpenseAmount('');
    setExpenseName('');
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  return <div className="app">
      <h1>Expense Tracker</h1>

      {!state.budgetSet ? (
        <div className="budget-form">
          <h2>Set Your Budget</h2>
          <form onSubmit={handleSetBudget}>
            <input
              type="number"
              placeholder="Enter budget amount"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              step="0.01"
              min="0"
            />
            <button type="submit">Set Budget</button>
          </form>
        </div>
      ) : (
        <>
          <div className="budget-summary">
            <div className="budget-item">
              <h3>Budget</h3>
              <p>${state.budget.toFixed(2)}</p>
            </div>
            {/* <div className="budget-item">
              <h3>Spent</h3>
              <p>${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="budget-item">
              <h3>Remaining</h3>
              <p className={remaining < 0 ? 'negative' : ''}>
                ${remaining.toFixed(2)}
              </p>
            </div> */}
          </div>

          <div className="expense-form">
            <h2>Add Expense</h2>
            <form onSubmit={handleAddExpense}>
              <input
                type="text"
                placeholder="Expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                step="0.01"
                min="0"
              />
              <button type="submit">Add Expense</button>
            </form>
          </div>

          <ExpenseList expenses={state.expenses} />

          <button onClick={handleReset} className="reset-button">
            Reset All
          </button>
        </>
      )}
    </div>;
}

export default App;
