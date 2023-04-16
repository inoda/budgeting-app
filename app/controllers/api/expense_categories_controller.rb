module Api
  class ExpenseCategoriesController < BaseController
    def index
      render json: ExpenseCategory.all
    end

    def destroy
      category = ExpenseCategory.find_by(id: params[:id])
      successful = category&.destroy || category.nil?
      render json: nil, status: successful ? 200 : 500
    end
  end
end
