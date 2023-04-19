import React, { useState, useEffect } from 'react';
import { Reports } from 'requests/resources';
import { Alerts } from 'utilities/main';
import ExpenseCategoryTotals from './expense_category_totals_table';
import ExpenseCategoryPercentages from './expense_category_percentages';
import SavingsVersusExpenses from './savings_versus_expenses';
import MonthlyBreakdown from './monthly_breakdown';

const Main = () => {
  const [reportData, setReportData] = useState(undefined);

  useEffect(() => {
    Reports.list({ transaction_date_min: '2022-01-01', transacton_date_max: '2023-05-01' }).then(
      setReportData,
      Alerts.genericError,
    );
  }, []);

  if (!reportData) return;

  if (reportData.totals_by_item_type.expenses + reportData.totals_by_item_type.savings === 0) {
    return <h1>Nothing to show</h1>
  }

  return (
    <>
      <MonthlyBreakdown monthlyDetails={reportData.monthly_details} />

      <SavingsVersusExpenses
        expensesTotal={reportData.totals_by_item_type.expenses}
        savingsTotal={reportData.totals_by_item_type.savings}
        numMonths={reportData.monthly_details.length}
      />

      <div className="flex-row">
        <div className="chart-container">
          <ExpenseCategoryPercentages percentagesByCategory={reportData.expense_totals_as_percentages} />
        </div>
        <ExpenseCategoryTotals
          totalsByCategory={reportData.expense_totals_by_category}
          numMonths={reportData.monthly_details.length}
        />
      </div>
    </>
  );
}

export default Main;
