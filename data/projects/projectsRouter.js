const express = require('express');

const Projects = require('../helpers/projectModel')

const router = express.Router()

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



//************************** ADD NEW PROJECT *************************/



//************************** UPDATE PROJECT *************************/



//************************** DELETE PROJECT *************************/

module.exports = router;