class UpdateCsvConfigsAgain < ActiveRecord::Migration[7.0]
  def change
    change_column :csv_configs, :spend_is_negative, :boolean, null: false, default: true
    change_column :csv_configs, :skip_non_spend, :boolean, null: false, default: false
    change_column :csv_configs, :memo_column_index, :integer, null: false, default: 9999999
    change_column :csv_configs, :category_column_index, :integer, null: false, default: 9999999
  end
end
