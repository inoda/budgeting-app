class AddsUniqueConstraintOnCatName < ActiveRecord::Migration[7.0]
  def change
    add_index :expense_categories, :name, unique: true
  end
end
