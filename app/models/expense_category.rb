class ExpenseCategory < ApplicationRecord
  validates_presence_of :name, :color
  validates_uniqueness_of :name

  has_many :line_items

  default_scope { order(rank: :asc, id: :asc) }
end
