'use strict';
const Mongoose = require('mongoose')
const mySecret = process.env['MONGO_URI']
Mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const projectSchema = new Mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String,
    default: ''
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String,
    default: ''
  },
  project: {
    type: String
  }
});
const Project = Mongoose.model("Project", projectSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  .get(function (req, res) {
  const { project } = req.params;
  const filters = req.query;

  const query = { project: project };
  Object.entries(filters).forEach(([field, value]) => {
    query[field] = value;
  });

  Project.find(query)
    .lean()
    .exec()
    .then((issues) => {
      res.json(issues);
    })
    .catch((err) => {
      console.error('Error retrieving issues:', err);
      res.status(500).json({ error: 'An error occurred' });
    });
})


    .post(function (req, res) {
      const { project } = req.params;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
      
     if (!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }
      
      const newIssue = new Project({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on: new Date(),
        update_on: new Date(),
        open: true,
        project: project
      });

      newIssue.save((err, saveIssues) => {
        if (err) {
          res.status(500).json({ error: 'An error occured' });
        } else {
          res.json(saveIssues);
        }
      });
    })

    .put(function (req, res) {
      const { project } = req.params;
      const { _id, ...update } = req.body

        if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

       if (Object.keys(update).length === 0) {
        res.json({ error: "no update field(s) sent", _id: _id });
        return;
      }
      update.updated_on = new Date()

      Project.findByIdAndUpdate(_id, update, {new: true}, (err, updatedIssues) => {
        if(err) {
          res.json({ error: "could not update", _id: _id });
        } else {
          res.json({ result: 'successfully updated', _id: _id })
        }
      })
    })

    .delete(function (req, res) {
      const { project } = req.params;
      const { _id } = req.body;
      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }
      Project.findByIdAndRemove(_id, (err, deletedIssues) => {
        if (err) {
          res.json({ error: 'could not delete', _id: _id });
        } else if (!deletedIssues) {
          res.json({ error: 'issue not found', _id: _id });
        } else {
          res.json({ result: 'successfully deleted', _id: _id });
        }
      });
    });

};
