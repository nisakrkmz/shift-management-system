class User < ApplicationRecord
  belongs_to :department, optional: true
  has_many :shifts
  has_many :time_off_requests
  has_many :shift_swap_requests_as_requester, class_name: 'ShiftSwapRequest', foreign_key: 'requester_id'
  has_many :shift_swap_requests_as_target_user, class_name: 'ShiftSwapRequest', foreign_key: 'target_user_id'
end
