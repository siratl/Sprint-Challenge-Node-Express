const express = require('express');

const Projects = require('../helpers/projectModel');

const router = express.Router();

//************************** GET ALL PROJECTS ************************/
router.get('/', async (req, res) => {
  Projects.get()
    .then(project => {
      res.status(200).json({ project });
    })
    .catch(err => {
      res.status(500).json({ error: 'Cannot retrieve Project.' });
    });
});

//************************** GET SPECIFIC PROJECT *************************/
router.get('/:id', (req, res) => {
  Projects.get(req.params.id)
    .then(project => {
      res.status(200).json({ project });
    })
    .catch(err => {
      res.status(500).json({ error: 'The project could not be retrieved.' });
    });
});

//************************** GET PROJECT ACTIONS *************************/
router.get('/actions/:id', (req, res) => {
  const { id } = req.params;

  Projects.get(id)
    .then(project => {
      if (project) {
        Projects.getProjectActions(id).then(actions => {
          res.json(actions);
        });
      } else {
        res.status(404).json({
          errorMessage: `The project with the specified ID '${id}' does not exist.`,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        error: `The Specified project '${id}' action(s) could not be retrieved.`,
      });
    });
});

//************************** ADD NEW PROJECT *************************/
router.post('/', (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res
      .status(422)
      .json({ errorMessage: 'Name and Description Required to add a project' });
  } else {
    Projects.insert({ name, description })
      .then(res => {
        if (res) {
          Projects.get().then(project => {
            res.json(project);
          });
        }
      })
      .catch(() => res.status(500).json({ error: 'Server Error' }));
  }
});

//************************** UPDATE PROJECT *************************/
router.put('/:id', (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    res.status(422).json({ errorMessage: 'Name and Description Required' });
  } else {
    Projects.get(req.params.id)
      .then(project => {
        if (project) {
          Projects.update(req.params.id, { name, description }).then(res => {
            if (res) {
              Projects.get().then(project => {
                es.json({ message: 'User updated', project });
              });
            } else {
              res
                .status(404)
                .json({
                  errorMessage:
                    'The project with the specified ID does not exist.',
                });
            }
          });
        } else {
          res.status(404).json({ errorMessage: 'Project Not Found' });
        }
      })
      .catch(() =>
        res
          .status(500)
          .json({ error: 'The user information could not be modified.' }),
      );
  }
});

//************************** DELETE PROJECT *************************/
router.delete('/:id', (req, res) => {
  Projects.remove(req.params.id)
    .then(res => {
      if (res) {
        Projects.get().then(deleted => res.json(deleted));
      } else {
        res.status(500).json({ errorMessage: 'Failed to delete project' });
      }
    })
    .catch(() => res.status(500).json({ error: 'Server Error' }));
});

module.exports = router;
