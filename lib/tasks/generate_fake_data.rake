task generate_fake_data: :environment do
  raise 'Only for local development' unless Rails.env.development?

  ExpenseCategory.destroy_all
  LineItem.destroy_all

  ExpenseCategory.create!(name: 'Rent', color: '#4263f5', rank: 0)
  ExpenseCategory.create!(name: 'Bills', color: '#AB6151', rank: 1)
  ExpenseCategory.create!(name: 'Food', color: '#fcba03', rank: 2)
  ExpenseCategory.create!(name: 'Shopping', color: '#51AB75', rank: 3)

  categories = ExpenseCategory.all

  1000.times do |n|
    LineItem.create!(
      memo: 'Lorem ipsum dolor sit amet',
      amount: rand(500..300000),
      transaction_date: rand((DateTime.now - 13.months)..DateTime.now),
      expense_category_id: categories.sample.id,
      item_type: LineItem::ITEM_TYPES[:expenses]
    )
  end

  300.times do |n|
    LineItem.create!(
      memo: 'Lorem ipsum dolor sit amet',
      amount: rand(100000..300000),
      transaction_date: rand((DateTime.now - 13.months)..DateTime.now),
      item_type: LineItem::ITEM_TYPES[:savings]
    )
  end
end
