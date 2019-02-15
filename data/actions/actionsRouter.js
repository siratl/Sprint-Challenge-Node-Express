const express = require('express');

const Actions = require('../helpers/actionModel')

const router = express.Router()

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



//************************** ADD NEW ACTION *************************/



//************************** UPDATE ACTION *************************/



//************************** DELETE ACTION *************************/

module.exports = router;