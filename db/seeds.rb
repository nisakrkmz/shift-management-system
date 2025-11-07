# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create Departments
department1 = Department.find_or_create_by!(name: 'Sales', manager_name: 'Alice Smith')
department2 = Department.find_or_create_by!(name: 'Marketing', manager_name: 'Bob Johnson')
department3 = Department.find_or_create_by!(name: 'Engineering', manager_name: 'Charlie Brown')

# Create Users
user1 = User.find_or_create_by!(name: 'John Doe', email: 'john.doe@example.com', department: department1)
user2 = User.find_or_create_by!(name: 'Jane Smith', email: 'jane.smith@example.com', department: department1)
user3 = User.find_or_create_by!(name: 'Peter Jones', email: 'peter.jones@example.com', department: department2)
user4 = User.find_or_create_by!(name: 'Sarah Davis', email: 'sarah.davis@example.com', department: department3)

# Create Shifts
shift1 = Shift.find_or_create_by!(user: user1, department: department1, start_time: DateTime.now.beginning_of_day + 9.hours, end_time: DateTime.now.beginning_of_day + 17.hours, break_minutes: 30, status: 0)
shift2 = Shift.find_or_create_by!(user: user2, department: department1, start_time: DateTime.now.beginning_of_day + 10.hours, end_time: DateTime.now.beginning_of_day + 18.hours, break_minutes: 60, status: 0)
shift3 = Shift.find_or_create_by!(user: user3, department: department2, start_time: DateTime.now.beginning_of_day + 8.hours, end_time: DateTime.now.beginning_of_day + 16.hours, break_minutes: 45, status: 0)
shift4 = Shift.find_or_create_by!(user: user4, department: department3, start_time: DateTime.now.beginning_of_day + 11.hours, end_time: DateTime.now.beginning_of_day + 19.hours, break_minutes: 30, status: 0)

# Create TimeOffRequests
TimeOffRequest.find_or_create_by!(user: user1, start_date: Date.tomorrow, end_date: Date.tomorrow + 2.days, reason: 'Vacation', status: 0)
TimeOffRequest.find_or_create_by!(user: user2, start_date: Date.tomorrow + 5.days, end_date: Date.tomorrow + 5.days, reason: 'Sick leave', status: 0)

# Create ShiftSwapRequests
ShiftSwapRequest.find_or_create_by!(requester: user1, requested_shift: shift2, target_user: user2, status: 0, note: 'Need to swap shifts for personal reasons.')
