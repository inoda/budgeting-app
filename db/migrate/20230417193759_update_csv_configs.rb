class UpdateCsvConfigs < ActiveRecord::Migration[7.0]
  def change
    change_table :csv_configs do |t|
      t.string :item_type, null: false
      t.boolean :has_header, null: false
      t.boolean :spend_is_negative, null: false
      t.boolean :skip_non_spend, null: false
      t.integer :memo_column_index, null: false
      t.integer :category_column_index, null: false
      t.integer :amount_column_index, null: false
      t.integer :transaction_date_column_index, null: false
      t.string :filename_match_substring, null: false
      t.string :memo_substrings_to_skip, array: true
      t.text :category_mappings_json

      t.remove :config_json
    end
  end
end
