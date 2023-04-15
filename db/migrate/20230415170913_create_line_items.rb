class CreateLineItems < ActiveRecord::Migration[7.0]
  def change
    create_table :line_items do |t|
      t.integer :amount, null: false
      t.string :type, null: false
      t.timestamp :transaction_date, null: false
      t.text :memo
      t.integer :expense_category_id

      t.timestamps

      t.index :amount
      t.index :type
      t.index :transaction_date
      t.index :expense_category_id
    end
  end
end
