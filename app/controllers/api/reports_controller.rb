module Api
  class ReportsController < BaseController
    def index
      generator = ReportGenerator.new(
        Date.parse(params[:transaction_date_min]).beginning_of_month,
        Date.parse(params[:transaction_date_max]).end_of_month + 1
      )

      render json: {
        totals_by_item_type: generator.totals_by_item_type,
        current_month_totals_by_item_type: generator.current_month_totals_by_item_type,
        monthly_details: generator.monthly_details,
        expense_totals_by_category: generator.expense_totals_by_category,
        expense_totals_as_percentages: generator.expense_totals_as_percentages,
      }
    end
  end
end
