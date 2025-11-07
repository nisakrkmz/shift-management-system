# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_07_074113) do
  create_table "departments", force: :cascade do |t|
    t.string "name"
    t.string "manager_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shift_swap_requests", force: :cascade do |t|
    t.integer "requester_id"
    t.integer "requested_shift_id"
    t.integer "target_user_id"
    t.integer "status"
    t.text "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shifts", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "department_id", null: false
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer "break_minutes"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_shifts_on_department_id"
    t.index ["user_id"], name: "index_shifts_on_user_id"
  end

  create_table "time_off_requests", force: :cascade do |t|
    t.integer "user_id", null: false
    t.date "start_date"
    t.date "end_date"
    t.text "reason"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_time_off_requests_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.integer "department_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["department_id"], name: "index_users_on_department_id"
  end

  add_foreign_key "shifts", "departments"
  add_foreign_key "shifts", "users"
  add_foreign_key "time_off_requests", "users"
  add_foreign_key "users", "departments"
end
