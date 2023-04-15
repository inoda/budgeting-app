class LineItem < ApplicationRecord
  validates_presence_of :amount, :type, :transaction_date

  belongs_to :expense_category
end
