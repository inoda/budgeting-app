# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_04_18_214700) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "csv_configs", force: :cascade do |t|
    t.text "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "item_type", null: false
    t.boolean "has_header", null: false
    t.boolean "spend_is_negative", default: true, null: false
    t.boolean "skip_non_spend", default: false, null: false
    t.integer "memo_column_index", default: 9999999, null: false
    t.integer "category_column_index", default: 9999999, null: false
    t.integer "amount_column_index", null: false
    t.integer "transaction_date_column_index", null: false
    t.string "filename_match_substring", null: false
    t.string "memo_substrings_to_skip", array: true
    t.text "category_mappings_json"
  end

  create_table "expense_categories", force: :cascade do |t|
    t.text "name", null: false
    t.string "color", null: false
    t.integer "rank", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_expense_categories_on_name", unique: true
    t.index ["rank"], name: "index_expense_categories_on_rank"
  end

  create_table "line_items", force: :cascade do |t|
    t.integer "amount", null: false
    t.string "item_type", null: false
    t.datetime "transaction_date", precision: nil, null: false
    t.text "memo"
    t.integer "expense_category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["amount"], name: "index_line_items_on_amount"
    t.index ["expense_category_id"], name: "index_line_items_on_expense_category_id"
    t.index ["item_type"], name: "index_line_items_on_item_type"
    t.index ["transaction_date"], name: "index_line_items_on_transaction_date"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "password", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
