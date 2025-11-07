class ShiftSwapRequest < ApplicationRecord
  belongs_to :requester, class_name: 'User'
  belongs_to :requested_shift, class_name: 'Shift'
  belongs_to :target_user, class_name: 'User'
end
