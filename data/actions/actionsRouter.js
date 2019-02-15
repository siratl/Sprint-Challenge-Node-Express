const express = require('express');

const Actions = require('../helpers/actionModel');

const Projects = require('../helpers/projectModel');

const router = express.Router();

//************************** GET ALL ACTIONS ************************/
router.get('/', async (req, res) => {
  Actions.get()
    .then(action => {
      res.status(200).json({ action });
    })
    .catch(err => {
      res.status(500).json({ error: 'Cannot retrieve Actions.' });
    });
});

//************************** GET SPECIFIC ACTION *************************/
router.get('/:id', (req, res) => {
  Actions.get(req.params.id)
    .then(action => {
      res.status(200).json({ action });
    })
    .catch(err => {
      res.status(500).json({ error: 'The action could not be retrieved.' });
    });
});

//************************** ADD NEW ACTION *************************/
router.post('/', (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  const newAction = { project_id, description, notes, completed };

  if (newAction.description.length > 128) {
    return res.status(412).json({
      errorMessage: 'Action description is more than 128 characters.',
    });
  }
  if (!description || !notes) {
    return res.status(417).json({
      errorMessage:
        'Description, project ID, and notes required for your action.',
    });
  } else {
    Projects.get(req.params.id)
      .then(project => {
        if (project) {
          Actions.insert(newAction)
            .then(newAction => {
              res
                .status(201)
                .json({ newAction, message: 'Action created successfully' });
            })
            .catch(err => {
              res.status(500).json({ error: 'The Action could not be saved.' });
            });
        } else {
          res.status(500).json({ error: 'No Valid project ID found.' });
        }
      })

      .catch(() =>
        res.status(500).json({ error: 'The Action could not be saved.' }),
      );
  }
});

//************************** UPDATE ACTION *************************/
router.put("/:id", (req, res) => {
    const { notes, description } = req.body;
    if (!description || !notes) {
      res.status(422).json({ message: "Description and Notes are required" });
    } else {
      Actions.update(req.param.id, { notes, description })
        .then(res => {
          if (res) {
            Actions.get().then(action => {
              res.json(action);
            });
          } else {
            res.status(404).json({ message: "Actions Update Failed." });
          }
        })
        .catch(() => {
          res.status(500).json({ message: "The Action could not be updated" });
        });
    }
  });

//************************** DELETE ACTION *************************/
router.delete("/:id", (req, res) => {
    Actions.remove(req.params.id)
      .then(res => {
        if (res) {
          Actions.get().then(action => {
            res.json(action);
          });
        } else {
          res.status(400).json({ message: `Failed to delete action with id ${req.params.id}` });
        }
      })
      .catch(() => {
        res.status(500).json({ message: "The Action could not be deleted" });
      });
  });

module.exports = router;
