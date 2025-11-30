
# Project Title

A brief description of what this project does and who it's for

https://capstone2-e-ha-health.vercel.app/

🏥 STMGT Hospital — Inventory & Equipment Assignment Portal

A lightweight React + Vite hospital inventory management system designed to help hospitals track equipment, manage staff, and maintain a complete history of equipment assignments.
Built for speed, clarity, and accountability — ideal for hospitals with limited digital infrastructure.

❗ Problem Statement

Most hospitals still rely on manual processes such as:

Paper-based inventory books

Verbal handovers

Poor or missing documentation

No timestamped assignment records

No way to track who last held an item

Frequent loss of equipment

No clear audit trail

Difficulty preparing reports

This leads to equipment loss, duplication of purchases, reduced efficiency, slow emergency response, and zero accountability.

Hospitals need a simple, digital, low-cost system that tracks:

Hospital equipment

Staff

Assignments (who is using what)

Full history for auditing

Returns & damage records

This project solves exactly that.

💡 What This Project Solves (The Solution)

STMGT Hospital Portal provides:

✅ Digital Equipment Inventory

Centralized location to store and manage all hospital equipment with details, categories, conditions, and current status.

✅ Staff Management

Keep proper digital records of all staff who can receive hospital equipment.

✅ Assignment & Tracking System

Assign equipment to staff with automatic timestamps and full history logs.

✅ Return & Status Updates

Mark items as returned, damaged, or missing.

✅ Audit-Ready History

Every action is logged:

Who took the item

When they took it

When they returned it

Notes, damages, etc.

✅ Protected Layout

Basic route protection simulates future authentication implementation.

🚀 Key Features
🔹 Equipment Management

Located in src/api/equipment.js
Functions:

getAllEquipment()

getEquipment()

createEquipment()

updateEquipment()

deleteEquipment()

🔹 Staff Management

Located in src/api/staff.js
Functions:

getAllStaff()

getStaff()

createStaff()

updateStaff()

deleteStaff()

🔹 Assignment Logging & History

Located in src/api/assignment.js
Functions:

logAssignment()

getAssignmentHistory()

getAllAssignments()

updateAssignment()

🔹 Centralized API Wrapper

Located in src/api/api.js:

get()

post()

put()

del()

🔹 Protected Route Handling

src/components/ProtectedRoute.jsx

🔹 Reusable UI Components

Sidebar

Navbar

EquipmentTable

AssignmentTable

🔹 Custom Hooks

Found in src/hooks/

useAuth

useFetch



🧰 Getting Started
Prerequisites

Node.js v16+

npm or pnpm or yarn

Install dependencies
npm install

Run the development server
npm run dev

Build for production
npm run build

Preview build
npm run preview



🔮 Future Enhancements

Full authentication (JWT or Firebase)

Role-based access: Admin / Staff

Equipment QR code scanning

Low-stock / maintenance alerts

Real database backend (Node, Supabase, Firebase)

PDF export of inventory & history

📌 Summary

STMGT Hospital Portal is a clean, organized system that solves a real-world problem in hospital operations:
tracking and accountability for medical equipment.
