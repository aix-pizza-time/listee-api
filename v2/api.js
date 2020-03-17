const controller = require('./controller');

module.exports = function (app, router) {
  // Mount router under API
  app.use('/api/v2', router);

  const available_routes = [
    {
      route: '/list',
      description: 'Retrieve or reset the current shopping list',
      supported_methods: ['GET', 'DELETE'],
      handler: {
        GET: (_, res, __) => {
          controller.get().then((data) => {
            res.json(data);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
        },
        DELETE: (_, res, __) => {
          controller.reset().then((data) => {
            res.json(data);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
        }
      }
    },{
      route: '/list/item/:id',
      description: 'Retrieve, modify or delete a specific item from the current list by id',
      supported_methods: ['GET', 'PUT', 'DELETE'],
      handler: {
        GET: (req, res, _) => {
          controller.get(req.params.id).then((data) => {
            res.json(data);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
        },
        PUT: (req, res, _) => {
          Promise.all([
            controller.rename(req.params.id, req.body),
            controller.learn(req.body)
          ]).then((data) => {
            res.json(data[0]);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
          
        },
        DELETE: (req, res, _) => {
          controller.delete(req.params.id).then((data) => {
            res.json(data);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
        }
      }
    },{
      route: '/list/item',
      description: 'Add a new item to the currently active list',
      supported_methods: ['POST'],
      handler: {
        POST: (req, res, _) => {
          console.log(req.body);
          Promise.all([
            controller.add(req.body),
            controller.learn(req.body)
          ]).then((data) => {
            res.json(data[0]);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
          
        },
      }
    },{
      route: '/lists',
      description: 'Retrieve a set of identifiers for all available lists',
      supported_methods: ['GET'],
      handler: {
        GET: (_, res, __) => {
          controller.lists().then(lists => {
            res.json(lists);
          }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
          });
        }
      }
    },{
      route: '/host',
      description: 'Set/Gets the host for the current gathering',
      supported_methods: ['GET', 'POST'],
      handler: {
        GET: (_, res, __) => {
          controller.getHost().then(host => {
            res.json(host);
          }).catch(err => {
            console.log(err);
            res.status(500).send(err.toSting());
          });
        },
        POST: (req, res, __) => {
          controller.getHost(req.body.host).then(host => {
            res.json({host: host});
          }).catch(err => {
            console.log(err);
            res.status(500).send(err.toSting());
          });
        },
      }
    },{
      route: '/next',
      description: 'Archives the current list and creates a new one',
      supported_methods: ['POST'],
      handler: {
        POST: (_, res, __) => {
          controller.next().then(_ => {
            res.json({'success': true});
          }).catch(err => {
            console.log(err);
            res.status(500).send(err.toSting());
          });
        }
      }
    },{
      route: '/learn',
      description: 'Gets the learned ingredients or adds a new one',
      supported_methods: ['GET'],
      handler: {
        GET: (_, res, __) => {
          controller.getLearned().then(ingredients => {
            res.json(ingredients);
          }).catch(err => {
            console.log(err);
            res.status(500).send(err.toString());
          })
        }
      }
    }
  ];

  // array containing all active routes. This gets displayed at $HOST/api/v2
  const active_routes = [];

  // Mount each route with the specific method 
  available_routes.forEach((r) => {
    r.supported_methods.forEach((m) => {
      switch(m){
        case 'GET':
          router.get(r.route, r.handler[m]);
          break;
        case 'POST':
          router.post(r.route, r.handler[m]);
          break;
        case 'PUT':
          router.put(r.route, r.handler[m]);
          break;
        case 'DELETE':
          router.delete(r.route, r.handler[m]);
          break;
        default: break;
      }
    });
    
    active_routes.push({
      route: process.env.HOST + '/api/v2' + r.route,
      description: r.description,
      supported_methods: r.supported_methods,
    });
  });

  // Human-readable service discovery / service documentation
  router.get('/', (_, res, __) => {
    res.json(active_routes);
  })
}