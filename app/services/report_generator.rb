class ReportGenerator
  def initialize(transacton_date_min, transacton_date_max)
    @transacton_date_min = transacton_date_min
    @transacton_date_max = transacton_date_max
    @month_list = (transacton_date_min...transacton_date_max).map { |d| d.strftime("%b %Y") }.uniq
  end

  def totals_by_item_type
    @totals_by_item_type ||= begin
      query = %{
        select item_type, sum(line_items.amount) as amount
        from line_items
        where transaction_date >= :min
        and transaction_date < :max
        group by item_type
      }

      result = ActiveRecord::Base.connection.execute(
        ApplicationRecord.sanitize_sql([
          query,
          {
            min: @transacton_date_min,
            max: @transacton_date_max,
            item_type: LineItem::ITEM_TYPES[:expenses]
          }
        ])
      )

      val = {}
      result.each { |r| val[r['item_type']] = r['amount'] }
      val
    end
  end

  def expense_totals_by_category
    query = %{
      select sum(line_items.amount) AS amount,
             expense_categories.name as category,
             expense_categories.color as color
      from line_items
      left outer join expense_categories on line_items.expense_category_id = expense_categories.id
      where item_type = :item_type
      and transaction_date >= :min
      and transaction_date < :max
      group by expense_categories.id
      order by amount desc
    }

    result = ActiveRecord::Base.connection.execute(
      ApplicationRecord.sanitize_sql([
        query,
        {
          min: @transacton_date_min,
          max: @transacton_date_max,
          item_type: LineItem::ITEM_TYPES[:expenses]
        }
      ])
    )

    result.to_a
  end

  def expense_totals_as_percentages
    query = %{
      select sum(line_items.amount) / :total AS percentage,
             expense_categories.name as category,
             expense_categories.color as color
      from line_items
      left outer join expense_categories on line_items.expense_category_id = expense_categories.id
      where item_type = :item_type
      and transaction_date >= :min
      and transaction_date < :max
      group by expense_categories.id
      order by percentage desc
    }

    result = ActiveRecord::Base.connection.execute(
      ApplicationRecord.sanitize_sql([
        query,
        {
          total: totals_by_item_type[LineItem::ITEM_TYPES[:expenses]].to_f,
          min: @transacton_date_min,
          max: @transacton_date_max,
          item_type: LineItem::ITEM_TYPES[:expenses]
        }
      ])
    )

    result.to_a
  end

  def monthly_details
    query = %{
      select line_items.item_type,
             to_char(date_trunc('month', transaction_date), 'Mon YYYY') AS month,
             sum(line_items.amount) AS amount,
             expense_categories.name as category,
             expense_categories.color as color
      from line_items
      left outer join expense_categories on line_items.expense_category_id = expense_categories.id
      where transaction_date >= :min
      and transaction_date < :max
      group by month, item_type, expense_categories.id
      order by expense_categories.rank asc, expense_categories.id asc
    }

    result = ActiveRecord::Base.connection.execute(
      ApplicationRecord.sanitize_sql([
        query,
        {
          min: @transacton_date_min,
          max: @transacton_date_max,
        }
      ])
    )

    val = []
    @month_list.each do |m|
      line_items = result.select { |i| i['month'] == m }
      savings = line_items.find { |i| i['item_type'] == LineItem::ITEM_TYPES[:savings] }
      expenses = line_items.select { |i| i['item_type'] == LineItem::ITEM_TYPES[:expenses] }.map do |i|
        { 'category' => i['category'], 'amount' => i['amount'], 'color' => i['color'] }
      end

      val << {
        'month' => m,
        'expenses' => expenses,
        'savings' => savings ? savings['amount'] : 0
      }
    end

    val
  end
end
