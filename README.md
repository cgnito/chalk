# Chalk Backend - School Fee Management (status)

## Setup
1. cd into backend/
2. Create a virtual environment: `python -m venv .venv`
3. Activate it: `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env`
6. run uvicorn app.main:app --reload
7. chalk.db will be ceated
7. add "/docs" at the end of url to view and test swagger ui

## Key Features Implemented
- **Authentication & Authorization**: Schools can create account, and login.
- **Admin CRUD**: add, update, delete Students
- **School Slugs**: Unique URLs for each school (e.g., `/public/royal-academy/search`).
- **Partial Payments**: Tracks total paid vs fee amount.
- **Interswitch Integration**: Ready for credential input, haven't gotten credentials (used the sand box)
note: used sqlite to be able to test things fast, will switch to postgres later