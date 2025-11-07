class CreateDepartments < ActiveRecord::Migration[8.0]
  def change
    create_table :departments do |t|
      t.string :name
      t.string :manager_name

      t.timestamps
    end
  end
end
