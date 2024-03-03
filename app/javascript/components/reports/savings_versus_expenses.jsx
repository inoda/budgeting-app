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
            <div className="stat">{Numerics.centsToWholeDollars(expensesTotal / numMonths)}</div>
            <div className="heading">monthly average</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToWholeDollars(expensesTotal)}</div>
            <div className="heading">total</div>
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
            <div className="stat">{Numerics.centsToWholeDollars(savingsTotal / numMonths)}</div>
            <div className="heading">monthly average</div>
          </div>

          <div className="separator"></div>

          <div className="data-tile">
            <div className="stat">{Numerics.centsToWholeDollars(savingsTotal)} ({Numerics.floatToPercent(percentSavings)}%)</div>
            <div className="heading">total</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseCategoryTotals;
