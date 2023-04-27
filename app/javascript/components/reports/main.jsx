import React, { useState, useEffect } from 'react';
import { Reports } from 'requests/resources';
import { Alerts } from 'utilities/main';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import ExpenseCategoryTotals from './expense_category_totals_table';
import ExpenseCategoryPercentages from './expense_category_percentages';
import SavingsVersusExpenses from './savings_versus_expenses';
import MonthlyBreakdown from './monthly_breakdown';

const Main = () => {
  const [transactionDateMin, setTransactionDateMin] = useState(moment().subtract(12, 'months').toDate());
  const [transactionDateMax, setTransactionDateMax] = useState(moment().add(1, 'day').toDate());
  const [reportData, setReportData] = useState(undefined);

  useEffect(() => {
    const params = {
      transactionDateMin: moment(transactionDateMin).format('YYYY-MM-DD'),
      transactionDateMax: moment(transactionDateMax).format('YYYY-MM-DD'),
    }
    Reports.list(params).then(
      setReportData,
      Alerts.genericError,
    );
  }, [transactionDateMin, transactionDateMax]);

  if (!reportData) return;

  if (reportData.totals_by_item_type.expenses + reportData.totals_by_item_type.savings === 0) {
    return <h1>Nothing to show</h1>
  }

  return (
    <>
      <div className="flex-row">
        <div>
          <DatePicker
            dateFormat="MMMM yyyy"
            selected={transactionDateMin}
            onChange={setTransactionDateMin}
            placeholderText="Start date"
            showMonthYearPicker
          />
        </div>
        <div>
          <DatePicker
            dateFormat="MMMM yyyy"
            selected={transactionDateMax}
            onChange={setTransactionDateMax}
            placeholderText="End date"
            showMonthYearPicker
          />
        </div>
      </div>

      <SavingsVersusExpenses
        expensesTotal={reportData.totals_by_item_type.expenses}
        savingsTotal={reportData.totals_by_item_type.savings}
        currentMonthExpensesTotal={reportData.current_month_totals_by_item_type.expenses}
        currentMonthSavingsTotal={reportData.current_month_totals_by_item_type.savings}
        numMonths={reportData.monthly_details.length}
      />

      <div className="bar-chart-section">
        <MonthlyBreakdown monthlyDetails={reportData.monthly_details} />
      </div>

      <div className="pie-chart-section">
        <div className="chart">
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
