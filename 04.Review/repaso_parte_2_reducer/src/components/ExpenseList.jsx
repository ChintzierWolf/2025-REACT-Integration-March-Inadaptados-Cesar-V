import ExpenseItem from './ExpenseItem'

function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-list">
        <h2>Gastos</h2>
        <p>No hay gastos</p>
      </div>
    )
  }

  return (
    <div className="expense-list">
      <h2>Expenses</h2>
      <div className="expenses">
        {expenses.map((expense) => (
          <ExpenseItem key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList