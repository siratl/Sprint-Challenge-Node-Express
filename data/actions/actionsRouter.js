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
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { notes, description } = req.body;
  const updateAction = { notes, description };

  Actions.update(id, updateAction)
    .then(updatedAction => {
      if (!updatedAction) {
        res
          .status(404)
          .json({
            message: 'The Action with the specified ID does not exist.',
          });
      } else if (!req.body) {
        res
          .status(417)
          .json({
            errorMessage:
              'Please insert Description and Notes for this action.',
          });
      } else {
        res.status(200).json({ message: 'Action updated', updatedAction });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The Action could not be updated' });
    });
});

//************************** DELETE ACTION *************************/
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Actions.remove(id)
    .then(deleted => {
      if (!deleted) {
        res
          .status(404)
          .json({
            message: 'The action with the specified ID does not exist.',
          });
      } else {
        res.status(200).json({ message: 'Action Deleted!', deleted });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'The Action could not be deleted' });
    });
});

module.exports = router;
