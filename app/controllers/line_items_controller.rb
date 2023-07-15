class LineItemsController < ApplicationController
  def index
  end

  def new
    @expense_categories = ExpenseCategory.all
    @line_item = LineItem.new
  end

  def create
    item = params[:line_item]

    LineItem.create!(
      memo: item[:memo],
      amount: item[:amount],
      item_type: item[:item_type],
      transaction_date: Date.parse(item[:transaction_date]),
      expense_category_id: item[:item_type] == LineItem::ITEM_TYPES[:expenses] ? item[:expense_category_id] : nil,
    )

    redirect_to line_items_path
  end
end
