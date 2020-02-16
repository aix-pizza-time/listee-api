const controller = require('./controller');

module.exports = function (app, router) {
  // Mount router under API
  app.use('/api/v2', router);

  const available_routes = [
    {
      route: '/list',
      description: 'Retrieve the current shopping list',
      supported_methods: ['GET'],
      method: router.get,
      handler: (_, res, __) => {
        controller.get().then((data) => {
          res.json(data);
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err.toString());
        });
      }
    },{
      route: '/list/item/:id',
      description: 'Retrieve a specific item from the current list by id',
      supported_methods: ['GET'],
      method: router.get,
      handler: (req, res, _) => {
        controller.get(req.params.id).then((data) => {
          res.json(data);
        }).catch((err) => {
          console.log(err);
          res.status(500).send(err.toString());
        });
      }
    },{
      route: '/lists',
      description: 'Retrieve a set of identifiers for all *available* lists',
      supported_methods: ['GET'],
      method: router.get,
      handler: (_, res, __) => {
        controller.lists().then(lists => {
          res.json(lists);
        }).catch((err) => {
          console.log(err);
          res.status(400).json({
            error: '400',
            msg: err.toString(),
          });
        })
      }
    }
  ];

  const register = ({route, method, handler}) => {
    method(route, handler);
  };


  router.get('/list', );

  router.get('/list/:id', );

  router.get('/lists', );

  router.post('/add', (req, res, next) => {
    controller.add(req.body.entry).then((data) => {
      res.json({
        newEntry: data,
        status: "ok"
      });
      next();
    }).catch((err) => {
      console.log(err);
      res.status(400).json({
        error: '400',
        msg: err.toString()
      });
    })
  });

  router.post('/commit', (req, res, next) => {
    controller.commit().then((data) => {
      res.json({
        status: "ok",
        lastState: data
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: '500',
        msg: err.toString()
      });
    })
  });

  router.post('/reset', (req, res, next) => {
    controller.reset().then((data) => {
      res.json({
        status: "ok",
        previousState: data
      });
    }).catch((err) => {
      console.log(err);
      res.status(400).json({
        error: '400',
        msg: err.toString()
      });
    })
  });

  router.delete('/delete/:id', (req, res, next) => {
    controller.delete(req.params.id).then((data) => {
      res.json({
        deletedEntry: data
      });
    }).catch((err) => {
      console.log(err);
      res.status(400).json({
        error: '400',
        msg: err.toString()
      })
    });
  });

  router.post('/rename/:id', (req, res, next) => {
    controller.rename(req.params.id, req.body.entry).then((data) => {
      res.json({
        changedEntry: data
      });
    }).catch((err) => {
      console.log(err);
      res.status(400).json({
        error: '400',
        msg: err.toString()
      })
    });
  });
}