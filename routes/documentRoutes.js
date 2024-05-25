const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { ensureAuthenticated } = require('../config/auth');

router.post('/', ensureAuthenticated, documentController.createDocument);

router.get('/:id', ensureAuthenticated, documentController.getDocument);

router.put('/:id', ensureAuthenticated, documentController.updateDocument);

router.put('/:id/revert/:versionId', ensureAuthenticated, documentController.revertDocument);

module.exports = router;
