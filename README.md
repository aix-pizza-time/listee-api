# Listee API

The backend RESTful webserver for the Listee (web)app. 

## v1 (deprecated)

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

## Deployment

### By hand

This is the least recommended, but probably the most verbose way of deploying this app.

Run `yarn` to install all NodeJS dependencies. Before starting the NodeJS app, make sure to provide the required env variables, i.e.

- `PORT`: the port the API listens to
- `REDIS_URL`: the url of redis, in this scenario probably localhost
- `POSTGRES_URL`: the url of postgres, in this scenario probably also localhost
- `HOST`: the exposed hostname of the API (this is used for the user-readable service discovery `/api/v2`)

Now, startup your databases, i.e. run `psql-server` and make sure to initialize the default database with the correct user +
password (docker, docker, docker), then run `redis-server --bind 0.0.0.0` to make redis listen to all incoming requests.
Note that as we do NOT expose the redis port, this is not a large security concern for outside access.

When both databases are up and running, you can deploy the API by running `yarn start`. Make sure to add an ingress rule
to your firewall for the exposed API port.

### Using docker-compose

Simply run `docker-compose up` to deploy the API + both DB services. You *may* want to comment out the live system, as
it requires the rest of the repository, i.e. the sources, to be present.

Rebuild the listee-api image using `docker-compose build`. 

If there occur any errors in the process of initialization, you need to purge the Docker Volumes, as Postgres detects them 
and will skip its auto-init phase. Run `docker-compose down && docker volume prune` and confirm to delete the dangling
volumes of this deployment.

Currently, both PostgreSQL and Redis **data volumes** are not persistent / locatable without further investigation into the 
docker volumes explicitly. Change the bottom `volumes` declaration in the docker-compose.yaml file to a more convenient 
directory for both services to store their data in.

### Using Kubernetes

Naturally, we want to deploy the services inside our Cluster. For this, the yamls in `k8s/` are tailored to our current
cluster configuration with the volumes correctly mounting themselves to the right places. Upon change of the cluster
topology, one might want to change mounting paths of the volume claims. Note that this only applies to the data mounts
for both Postgres and Redis services. The configurations are mounted as ConfigMaps and thanks to Kubernetes populated into the
cluster automatically.

To deploy the complete service at once, run `kubectl apply -f k8s/` and watch everything boot up. 

Depending on the ingress, you can customize the domain settings in `k8s/ingress.yaml`.