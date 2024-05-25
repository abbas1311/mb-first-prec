const Document = require('../models/Document');

exports.createDocument = async (req, res) => {
  const { title, content } = req.body;
  const newDocument = new Document({ title, content });
  await newDocument.save();
  res.status(201).json(newDocument);
};

exports.getDocument = async (req, res) => {
  const document = await Document.findById(req.params.id);
  res.status(200).json(document);
};

exports.updateDocument = async (req, res) => {
  const { content } = req.body;
  const document = await Document.findById(req.params.id);
  document.versions.push({ content: document.content });
  document.content = content;
  await document.save();
  res.status(200).json(document);
};

exports.revertDocument = async (req, res) => {
  const { versionId } = req.params;
  const document = await Document.findById(req.params.id);
  const version = document.versions.id(versionId);
  document.content = version.content;
  await document.save();
  res.status(200).json(document);
};
