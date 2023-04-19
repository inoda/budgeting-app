class OntrackImportsController < ApplicationController
  def new
  end

  def create
    file_contents = File.read(params[:file].tempfile)
    csv = CSV.parse(file_contents)

    ActiveRecord::Base.transaction do
      csv.each_with_index do |row, idx|
        next if idx == 0 # skip header

        transaction_date = row[0]
        amount_in_cents = row[1]
        category_name = row[2]
        memo = row[3]
        category_color = row[4]
        category_rank = row[5]

        category = ExpenseCategory.find_or_create_by!(name: category_name, color: category_color, rank: category_rank)

        LineItem.create!(
          transaction_date: transaction_date,
          amount: amount_in_cents,
          expense_category_id: category.id,
          memo: memo,
          item_type: LineItem::ITEM_TYPES[:expenses]
        )
      end
    end

    redirect_to line_items_path
  end
end
