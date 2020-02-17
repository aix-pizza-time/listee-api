const controller = require('./controller');

module.exports = function (app, router) {
  // Mount router under API
  app.use('/api/v1', router);

  router.get('/list', (req, res, next) => {
    controller.get().then((data) => {
      res.json({
        currentList: data,
        status: "deprecated"
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: '500',
        msg: err.toString(),
      });
    })
  });

  // router.get('/committed', (req, res, next) => {
  //   controller.committed().then((data) => {
  //     res.json({
  //       committed: data,
  //       status: 'ok'
  //     });
  //   }).catch((err) => {
  //     console.log(err);
  //     res.status(500).json({
  //       error: '500',
  //       msg: err.toString(),
  //     });
  //   });
  // });

  router.get('/list/:id', (req, res, next) => {
    controller.get(req.params.id).then((data) => {
      res.json({
        list: data,
        status: "deprecated"
      });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({
        error: '500',
        msg: err.toString(),
      });
    })
  });

  router.get('/lists', (req, res, next) => {
    controller.lists().then(list => {
      res.json({
        archive: list,
        status: "deprecated"
      });
    }).catch((err) => {
      console.log(err);
      res.status(400).json({
        error: '400',
        msg: err.toString(),
      });
    })
  });

  router.post('/add', (req, res, next) => {
    controller.add(req.body.entry).then((data) => {
      res.json({
        newEntry: data,
        status: "deprecated"
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
        status: "deprecated",
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
        status: "deprecated",
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