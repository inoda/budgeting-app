module Api
  class ReportsController < BaseController
    def index
      generator = ReportGenerator.new(
        Date.parse(params[:transaction_date_min]),
        Date.parse(params[:transacton_date_max])
      )

      render json: {
        totals_by_item_type: generator.totals_by_item_type,
        monthly_details: generator.monthly_details,
        expense_totals_by_category: generator.expense_totals_by_category,
        expense_totals_as_percentages: generator.expense_totals_as_percentages,
      }
    end
  end
end
