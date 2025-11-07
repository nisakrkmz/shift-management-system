module Api
  module V1
    class TimeOffRequestsController < ApplicationController
      before_action :set_time_off_request, only: [:show, :update, :destroy]

      # GET /time_off_requests
      def index
        @time_off_requests = TimeOffRequest.all
        render json: @time_off_requests
      end

      # GET /time_off_requests/1
      def show
        render json: @time_off_request
      end

      # POST /time_off_requests
      def create
  @time_off_request = TimeOffRequest.new(time_off_request_params)

  if @time_off_request.save
    render json: @time_off_request, status: :created, location: api_v1_time_off_request_url(@time_off_request)
  else
    render json: @time_off_request.errors, status: :unprocessable_entity
  end
end


      # PATCH/PUT /time_off_requests/1
      def update
        if @time_off_request.update(time_off_request_params)
          render json: @time_off_request
        else
          render json: @time_off_request.errors, status: :unprocessable_entity
        end
      end

      # DELETE /time_off_requests/1
      def destroy
        @time_off_request.destroy
      end

      private
        # Use callbacks to share common setup or constraints between actions.
        def set_time_off_request
          @time_off_request = TimeOffRequest.find(params[:id])
        end

        # Only allow a list of trusted parameters through.
        def time_off_request_params
          params.require(:time_off_request).permit(:user_id, :start_date, :end_date, :reason, :status)
        end
    end
  end
end
