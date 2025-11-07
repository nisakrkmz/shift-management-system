class CreateShiftSwapRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :shift_swap_requests do |t|
      t.integer :requester_id
      t.integer :requested_shift_id
      t.integer :target_user_id
      t.integer :status
      t.text :note

      t.timestamps
    end
  end
end
