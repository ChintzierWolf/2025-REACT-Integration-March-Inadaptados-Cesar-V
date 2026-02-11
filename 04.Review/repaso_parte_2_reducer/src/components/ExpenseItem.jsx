function ExpenseItem({ expense }) {
  return (
    <div className="expense-item">
      <span className="expense-name">{expense.name}</span>
      <span className="expense-amount">${expense.amount.toFixed(2)}</span>
    </div>
  )
}

export default ExpenseItem