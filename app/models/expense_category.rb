class ExpenseCategory < ApplicationRecord
  validates_presence_of :name, :color

  has_many :line_items

  default_scope { order(rank: :asc, id: :asc) }
end
