import React from 'react';
import { Numerics } from 'utilities/main';

const ExpenseCategoryTotals = ({ expensesTotal, savingsTotal, currentMonthExpensesTotal, currentMonthSavingsTotal, numMonths }) => {
  const percentSavings = savingsTotal / (expensesTotal + savingsTotal);

  return (
    <>
      <div className="section">
        <div className="title">expenses</div>

        <div className="key-stats">
          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(currentMonthExpensesTotal)}</div>
            <div className="heading">this month</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(expensesTotal)}</div>
            <div className="heading">total</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(expensesTotal / numMonths)}</div>
            <div className="heading">monthly average</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="title">savings</div>

        <div className="key-stats">
          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(currentMonthSavingsTotal)}</div>
            <div className="heading">this month</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(savingsTotal)} ({Numerics.floatToPercent(percentSavings)}%)</div>
            <div className="heading">total</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToDollars(savingsTotal / numMonths)}</div>
            <div className="heading">monthly average</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseCategoryTotals;


// <div>This month: {Numerics.centsToDollars(currentMonthExpensesTotal)}</div>
// <div>Total: {Numerics.centsToDollars(expensesTotal)}</div>
// <div>Average: {Numerics.centsToDollars(expensesTotal / numMonths)}</div>
