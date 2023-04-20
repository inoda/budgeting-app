task(:add_savings, [:amount_in_cents, :memo] => :environment) do |_, args|
  LineItem.create!(
    memo: args[:memo],
    amount: args[:amount_in_cents],
    transaction_date: DateTime.now,
    item_type: LineItem::ITEM_TYPES[:savings]
  )
end
