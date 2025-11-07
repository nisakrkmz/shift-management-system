module Api
  module V1
    class ShiftSwapRequestsController < ApplicationController
      before_action :set_shift_swap_request, only: [:show, :update, :destroy]

      # GET /shift_swap_requests
      def index
        @shift_swap_requests = ShiftSwapRequest.all
        render json: @shift_swap_requests
      end

      # GET /shift_swap_requests/1
      def show
        render json: @shift_swap_request
      end

      # POST /shift_swap_requests
      def create
  @shift_swap_request = ShiftSwapRequest.new(shift_swap_request_params)

  if @shift_swap_request.save
    render json: @shift_swap_request, status: :created
  else
    render json: @shift_swap_request.errors, status: :unprocessable_entity
  end
end


      # PATCH/PUT /shift_swap_requests/1
      def update
        if @shift_swap_request.update(shift_swap_request_params)
          render json: @shift_swap_request
        else
          render json: @shift_swap_request.errors, status: :unprocessable_entity
        end
      end

      # DELETE /shift_swap_requests/1
      def destroy
        @shift_swap_request.destroy
      end

      private
        # Use callbacks to share common setup or constraints between actions.
        def set_shift_swap_request
          @shift_swap_request = ShiftSwapRequest.find(params[:id])
        end

        # Only allow a list of trusted parameters through.
        def shift_swap_request_params
          params.require(:shift_swap_request).permit(:requester_id, :requested_shift_id, :target_user_id, :status, :note)
        end
    end
  end
end
