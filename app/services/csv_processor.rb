class CsvProcessor
  def initialize(csv_rows, csv_config)
    @csv_rows = csv_rows
    @config = csv_config
  end

  def process!
    output = []
    @csv_rows.each_with_index do |row, i|
      next if skip_row?(row, i)
      output << process_row(row)
    end
    output
  end

  private

  def categories_ids_by_lower_name
    @categories_ids_by_lower_name ||= ExpenseCategory.all.index_by { |c| c.name.downcase }.transform_values { |c| c.id }
  end

  def category_mappings
    @category_mappings ||= @config.category_mappings_json ? JSON.parse(@config.category_mappings_json) : {}
  end

  def spend_multiplier
    @config.spend_is_negative ? -1 : 1
  end

  def skip_row?(row, index)
    if index == 0 && @config.has_header
      return true
    end

    if @config.memo_substrings_to_skip&.any? { |str| row[@config.memo_column_index]&.downcase&.include? str.downcase }
      return true
    end

    if @config.skip_non_spend && row[@config.amount_column_index].to_f > 0
      return true
    end

    false
  end

  def process_row(row)
    expense_category_id = get_category_id(row)
    transaction_date = Chronic.parse(row[@config.transaction_date_column_index])
    memo = format_memo(row[@config.memo_column_index])
    amount = row[@config.amount_column_index].to_f * 100 * spend_multiplier

    {
      id: "#{transaction_date}-#{amount}-#{memo}",
      transaction_date: transaction_date,
      memo: memo,
      expense_category_id: expense_category_id,
      amount: amount,
      item_type: @config.item_type,
    }
  end

  def get_category_id(row)
    return unless @config.item_type == LineItem::ITEM_TYPES[:expenses]

    category = row[@config.category_column_index]
    mapped_category = category_mappings[category] || category
    categories_ids_by_lower_name[mapped_category&.downcase]
  end

  def format_memo(s)
    return nil unless s&.strip&.present?

    desc = s.gsub(/(\W|\d)/, ' ') # strip non word chars
    desc = desc.gsub(/\s+/, ' ').strip # normalize multiple spaces
    desc = desc.split.map { |d| d.downcase.capitalize }.join(' ') # titleize
    desc
  end
end
