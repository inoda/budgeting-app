class CreateExpenseCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :expense_categories do |t|
      t.text :name, null: false
      t.string :color, null: false
      t.integer :rank, null: false

      t.timestamps

      t.index :rank
    end
  end
end
