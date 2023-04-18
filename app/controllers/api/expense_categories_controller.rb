module Api
  class ExpenseCategoriesController < BaseController
    def index
      render json: ExpenseCategory.all
    end
  end
end
