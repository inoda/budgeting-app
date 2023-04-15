class LineItem < ApplicationRecord
  ITEM_TYPES = {
    expenses: 'expenses',
    savings: 'savings',
  }

  validates_presence_of :amount, :item_type, :transaction_date
  validates :item_type, inclusion: ITEM_TYPES.values
  validate :type_and_category

  belongs_to :expense_category, optional: true

  private

  def type_and_category
    if item_type == ITEM_TYPES[:expenses] && expense_category_id.nil?
      errors.add(:expense_category_id, "required")
    end

    if item_type == ITEM_TYPES[:savings] && expense_category_id.present?
      errors.add(:expense_category_id, "not allowed")
    end
  end
end
