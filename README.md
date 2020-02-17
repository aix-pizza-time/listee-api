# Listee API

The backend RESTful webserver for the Listee (web)app. 

## v1

The v1 api is reachable under `/api/v1/` and the backend is file-based. This is obviously a bad idea, but it was hacked
away quick and dirty and worked for a while. However, as we plan to extend the project, we introduced API v2 to start
completely new

## v2

The v2 API uses a postgres backend for proper data storage. Also the API routes are now discoverable using `GET
/api/v2/`.

## Routes

- `GET /api/v2`: Get all available routes grouped by http methods.
- `GET /api/v2/lists`: Get all available lists with ids and more metadata
- `GET /api/v2/list`: Get the currently active list
- `DELETE /api/v2/list`: Clear the currently active list
- `GET /api/v2/list/item`