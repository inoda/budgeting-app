namespace(:ontrack_importer) do
  task(create: :environment) do
    CsvConfig.create!(
      name: 'Ontrack',
      item_type: LineItem::ITEM_TYPES[:expenses],
      has_header: true,
      filename_match_substring: 'ontrack',
      spend_is_negative: false,
      skip_non_spend: false,
      transaction_date_column_index: 0,
      amount_column_index: 1,
      category_column_index: 2,
      memo_column_index: 3,
    )
  end
end
