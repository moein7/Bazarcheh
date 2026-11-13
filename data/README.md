# data/

Put the export files you received here. This folder is mounted into the backend container at `/data`.


The backend also creates `bazarcheh.db` in this directory at runtime. It stores the activity history and sanitized approved-reply style memory. Keep this file to preserve history across Docker restarts; remove it only to intentionally reset both.
