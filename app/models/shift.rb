class Shift < ApplicationRecord
  belongs_to :user
  belongs_to :department
  has_one :shift_swap_request_as_requested_shift, class_name: 'ShiftSwapRequest', foreign_key: 'requested_shift_id'
end
