# Listee API

The backend RESTful webserver for the Listee (web)app. 

## v1

The v1 API is reachable under `/api/v1/` and the backend is file-based. This is obviously a bad idea, but it was hacked
away quick and dirty and worked for a while. However, as we plan to extend the project, we introduced API v2 to start
completely new

## v2

The v2 API uses a PostgreSQL + Redis backend for proper data storage. Also the API routes are now discoverable using `GET
/api/v2/`.

## Routes

- `GET /api/v2`: Get all available routes grouped by http methods.
- `GET /api/v2/lists`: Get all available lists with ids and more metadata
- `GET /api/v2/list`: Get the currently active list
- `DELETE /api/v2/list`: Clear the currently active list
- `GET /api/v2/list/item`: Get the metadata of a specific item identified by ID
- `GET /api/v2/learn`: Get all learned ingredients
- `POST /api/v2/list/items`: Add a specific item to the list and also learn it, if not already present in the Redis set
- `PUT /api/v2/list/item/:id`: Change a specific item's name. Also learns the new name.