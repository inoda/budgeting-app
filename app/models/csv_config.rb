# TO CREATE A CONFIG (in Rails console):
#
# CsvConfig.create!(
#   name: 'Credit card',
#   item_type: LineItem::ITEM_TYPES[:expenses],
#   has_header: true,
#   filename_match_substring: 'BankAccount9999',
#   spend_is_negative: true,
#   skip_non_spend: false,
#   transaction_date_column_index: 0,
#   memo_column_index: 2,
#   category_column_index: 3,
#   amount_column_index: 5,
#   memo_substrings_to_skip: ['Payment made'],
#   category_mappings_json: { 'Gas' => 'Car' }.to_json
# )

class CsvConfig < ApplicationRecord
  validates_presence_of :name, :has_header, :filename_match_substring, :amount_column_index, :transaction_date_column_index
  validates :item_type, inclusion: LineItem::ITEM_TYPES.values

  validate :category_mappings_json_format

  def category_mappings_json_format
    return unless category_mappings_json.present?

    begin
      JSON.parse(category_mappings_json)
    rescue JSON::ParserError
      errors.add(:config_json, "Invalid JSON in category_mappings_json")
    end
  end
end
