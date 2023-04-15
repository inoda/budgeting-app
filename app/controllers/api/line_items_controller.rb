module Api
  class LineItemsController < BaseController
    def index
      items = ::LineItem.all
      items = items.where('transaction_date >= ?', Time.at(params[:transaction_date_min].to_i).to_datetime) if params[:transaction_date_min].present?
      items = items.where('transaction_date <= ?', Time.at(params[:transaction_date_max].to_i).to_datetime) if params[:transaction_date_max].present?
      items = items.where("lower(memo) ILIKE ?", "%#{params[:search].strip}%") if params[:search]&.strip.present?
      items = items.where(expense_category_id: params[:expense_category_id]) if params[:expense_category_id].present?
      items = items.order(normalized_sort(params[:sort], params[:sort_desc])).order(id: :desc) if params[:sort]
      items = items.paginate(params[:page], params[:per_page]) if params[:page]

      paginated_response(items)
    end

    private

    def normalized_sort(key, sort_desc)
      cols = { transaction_date: "transaction_date", amount: "amount" }
      col = cols[key.to_sym] || "transaction_date"
      dir = sort_desc == "true" ? "DESC" : "ASC"
      "#{col} #{dir}"
    end
  end
end
