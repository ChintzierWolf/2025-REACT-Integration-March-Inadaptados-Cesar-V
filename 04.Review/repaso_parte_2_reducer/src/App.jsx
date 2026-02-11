import { useState, useReducer } from 'react'
import { expenseReducer, initialState } from './reducers/expenseReducer'
import ExpenseList from './components/ExpenseList'
import './App.css'

function App() {

  const [count, setCount] = useState(0); 
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const [budgetInput, setBudgetInput] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleSetBudget = (e) => {
    // La e es el evento que se dispara cuando se envia el formulario
    // e.preventDefault() es para que no se recargue la pagina
    e.preventDefault();
    const budget = parseFloat(budgetInput);
    if (budget > 0) {
      dispatch({ type: 'SET_BUDGET', payload: budget });
      setBudgetInput('');
    }
  }

  const handleAddExpense = (e) => {
    e.preventDefault();
    // parseFloat() es para convertir el valor del input a numero
    // isNaN() es para verificar si el valor es un numero
    const expense = parseFloat(expenseAmount);
    // trim() es para eliminar los espacios en blanco del valor del input
    if (expense > 0 && expenseName.trim() !== "") {
      dispatch({ type: 'ADD_EXPENSE', payload: { name: expenseName, amount: expense, id: Date.now() } });
      setExpenseName('');
      setExpenseAmount('');
    }
  }

  const handleResetExpense = () => {
    dispatch({ type: 'RESET_EXPENSE' });
  }

  const handleDeleteExpense = (id) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  }

  const handleUpdateExpense = (id, expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: { id, expense } });
  }

  return (
    <>
      <h1>Contador</h1>
      <p>Valor actual: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
      <button onClick={() => setCount(count - 1)}>Decrementar</button>
      <button onClick={() => setCount(0)}>Resetear</button>

      <hr />

      <h1>Gastos</h1>
      <p>Presupuesto: {state.budget}</p>
      <p>Gastos: {state.expenses}</p>
      <p>Restante: {state.remaining}</p>
      <p>Total de gastos: {state.totalExpenses}</p>
      <p>Conteo: {state.count}</p>

      <hr/>

      <div className="budget-form">
        <form onSubmit={handleSetBudget}>
          <input 
            type="number" 
            placeholder="Presupuesto" 
            value={budgetInput} 
            onChange={(e) => setBudgetInput(e.target.value)} 
          />
          <button type="submit">Establecer presupuesto</button>
        </form>
      </div>

      <div className="expense-form">
        <form onSubmit={handleAddExpense}>
          <input 
            type="text" 
            placeholder="Nombre del gasto" 
            value={expenseName} 
            onChange={(e) => setExpenseName(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Monto del gasto" 
            value={expenseAmount} 
            onChange={(e) => setExpenseAmount(e.target.value)} 
          />
          <button type="submit">Agregar gasto</button>
        </form>
      </div>

      <div className="budget-summary">
        <div className="budget-item">
          <h3>Presupuesto</h3>
          <p>{state.budget}</p>
        </div>
        <div className="budget-item">
          <h3>Gastos</h3>
          <p>{state.totalExpenses}</p>
        </div>
        <div className="budget-item">
          <h3>Restante</h3>
          <p>{state.remaining}</p>
        </div>
      </div>

      <div className="expense-list">
        <h3>Gastos</h3>
        <div className="expenses">
          {state.expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <span>{expense.name}</span>
              <span>{expense.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleResetExpense}>Resetear</button>
    </>
  )
}

export default App
