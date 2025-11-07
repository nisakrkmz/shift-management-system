class CreateShifts < ActiveRecord::Migration[8.0]
  def change
    create_table :shifts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :department, null: false, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.integer :break_minutes
      t.integer :status

      t.timestamps
    end
  end
end
