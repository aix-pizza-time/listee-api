# PostgreSQL init scripts -> k8s configmap

Run
```sh
kubectl create configmap listee-postgres-init-configmap --from-file ./configmaps
```
to create a ConfigMap containing each initialization script in this directory.

Then, in your deployment manifest, include the ConfigMap to your PostgreSQL deployment using

```yaml
containers:
- name: my-postgres
  image: postgres:latest
  ...
  volumeMounts:
  - mountPath: /docker-entrypoint-initdb.d
    name: initialization
volumes:
- name: initialization
  configMap:
    name: listee-postgres-init
    # Explicitly mount specific files
    # items:
    # - key: script1.sh
    #   path: script1.sh
    # - key: script2.sql
    #   path: script2.sql
```
