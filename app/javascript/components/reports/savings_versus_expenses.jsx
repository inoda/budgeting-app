import React from 'react';
import { Numerics } from 'utilities/main';

const ExpenseCategoryTotals = ({ expensesTotal, savingsTotal, currentMonthExpensesTotal, currentMonthSavingsTotal, numMonths }) => {
  const percentSavings = savingsTotal / (expensesTotal + savingsTotal);

  return (
    <>
      <h2>{Numerics.floatToPercent(percentSavings)}% savings</h2>
      <div className="flex-row space-between">
        <div>
          Expenses

          <div>This month: {Numerics.centsToDollars(currentMonthExpensesTotal)}</div>
          <div>Total: {Numerics.centsToDollars(expensesTotal)}</div>
          <div>Average: {Numerics.centsToDollars(expensesTotal / numMonths)}</div>
        </div>

        <div>
          Savings

          <div>This month: {Numerics.centsToDollars(currentMonthSavingsTotal)}</div>
          <div>Total: {Numerics.centsToDollars(savingsTotal)}</div>
          <div>Average: {Numerics.centsToDollars(savingsTotal / numMonths)}</div>
        </div>
      </div>
    </>
  );
}

export default ExpenseCategoryTotals;
