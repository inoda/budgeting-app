require 'csv'

module Api
  class LineItemsController < BaseController
    def index
      items = LineItem.all

      if params[:transaction_date_min].present?
        items = items.where('transaction_date >= ?', Time.at(params[:transaction_date_min].to_i).to_datetime)
      end

      if params[:transaction_date_max].present?
        items = items.where('transaction_date <= ?', Time.at(params[:transaction_date_max].to_i).to_datetime)
      end

      if params[:search]&.strip.present?
        items = items.left_outer_joins(:expense_category)
        items = items.where("lower(memo) ILIKE ? OR lower(expense_categories.name) ILIKE ?", "%#{params[:search].strip}%", "%#{params[:search].strip}%")
      end

      if params[:sort]
        items = items.order(normalized_sort(params[:sort], params[:sort_desc])).order(id: :desc) if params[:sort]
      end

      resp = items.paginate(page, per_page)
      paginated_response(resp)
    end

    def destroy
      item = LineItem.find_by(id: params[:id])
      successful = item&.destroy || item.nil?
      render json: nil, status: successful ? 200 : 500
    end

    def update
      item = LineItem.find(params[:id])

      successful = item.update(
        expense_category_id: params.fetch(:expense_category_id, item.expense_category_id),
        memo: params.fetch(:memo, item.memo),
        transaction_date: params.fetch(:transaction_date, item.transaction_date),
        amount: params.fetch(:amount, item.amount),
      )

      render json: item, status: successful ? 200 : 500
    end

    def upload
      csv_configs = CsvConfig.all.
        map { |c| JSON.parse(c.config_json) }.
        index_by { |s| s['auto_detect']['filename_substrings'] }

      rows = []

      params[:files].each do |f|
        file_contents = File.read(f.tempfile)
        csv = CSV.parse(file_contents)

        csv_config = csv_configs.find do |filename_substrings, _|
          filename_substrings.find { |substring| f.original_filename.include?(substring) }
        end

        unless csv_config
          raise "'#{f.original_filename}' does not match any csv_config records. Set one up following the example in csv_config.rb."
        end

        # processed_csv = CsvProcessor.new(csv, csv_config).process!
        # processed_csv.each do |item|
        #   amount = item[:amount]
        #   transaction_date = item[:transaction_date]
        #   memo = item[:memo]
        #   expense_category_id = item[:expense_category_id]
        #   item_type = item[:item_type]

        #   next if skip_existing && LineItem.exists?(amount: amount, paid_at: transaction_date, memo: memo)

        #   rows << item
        # end
      end

      render json: rows
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
