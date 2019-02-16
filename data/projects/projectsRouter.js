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
  const newProject = { name, description };

  if (!newProject) {
    return res
      .status(417)
      .json({
        errorMessage: 'Name and Description Required to add a project.',
      });
  }

  Projects.insert(newProject)
    .then(project => {
      res.status(200).json({ newProject, project });
    })
    .catch(err => {
      res.status(500).json({ error: 'The Project could not be saved.' });
    });
});

//************************** UPDATE PROJECT *************************/
router.put('/:id', (req, res) => {

  const id = req.params.id;
  const { name, description } = req.body;
  const updateProject = { name, description };

  Projects.update(id, updateProject)
    .then(updatedProject => {
      if (!updatedProject) {
        res
          .status(404)
          .json({
            message: 'The Project with the specified ID does not exist.',
          });
      } else if (!req.body) {
        res
          .status(417)
          .json({
            errorMessage:
              'Please insert Description and Name for this Project.',
          });
      } else {
        res.status(200).json({ message: 'Project updated', updatedProject });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The Project could not be updated' });
    });
});

//************************** DELETE PROJECT *************************/
router.delete('/:id', (req, res) => {
    const id = req.params.id;
  
    Projects.remove(id)
      .then(deleted => {
        if (!deleted) {
          res
            .status(404)
            .json({
              message: 'The project with the specified ID does not exist.',
            });
        } else {
          res.status(200).json({ message: 'Project Deleted!', deleted });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'The Project could not be deleted' });
      });
  });
module.exports = router;
