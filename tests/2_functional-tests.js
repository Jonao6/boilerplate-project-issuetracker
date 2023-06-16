const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);
let deleteID;
suite('Functional Tests', function() {
  suite('POST /api/issues/{project} => object with issue data', () => {
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .send({
        issue_title: "Test",
        issue_text: "Functional Test",
        created_by: "FCC",
        assigned_to: "Jonao",
        status_text: "Its OK"
      })
        .end((err, res) => {
        assert.equal(res.status, 200);
       deleteID = res.body._id
        assert.equal(res.body.issue_title, "Test");
        assert.equal(res.body.issue_text, "Functional Test");
        assert.equal(res.body.created_by, "FCC");
        assert.equal(res.body.assigned_to, "Jonao");
        assert.equal(res.body.status_text, "Its OK")
       done()
      })
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .send({
        issue_title: "Test2",
        issue_text: "Functional Test",
        created_by: "FCC",
        assigned_to: "",
        status_text: ""
      })
      .end((err, res) => {
         assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "Test2");
        assert.equal(res.body.issue_text, "Functional Test");
        assert.equal(res.body.created_by, "FCC"); 
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "")
        done()
      })
    });
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .post('/api/issues/projects')
      .send({
        issue_title: "Test",
        issue_text: "",
        created_by: "",
        assigned_to: "",
        status_text: ""
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");
        done()
      })
    });
   
  })
  
  suite('GET /api/issues/{project} => object with issue data', () => {
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .get("/api/issues/fcc-project")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 98);
        done()
      })
    })
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .get("/api/issues/fcc-project")
      .query({
        _id: "648b6c3b72943a229dc13f95"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body[0], {
        _id: '648b6c3b72943a229dc13f95', 
        assigned_to: "Chai and Mocha",
        open: true,
        status_text: "",
        issue_title: "Faux Issue Title 2",
        issue_text: "Functional Test - Every field filled in",
        created_by: "fCC",
        created_on: '2023-06-15T19:53:31.403Z',
        project: "fcc-project",
        updated_on: '2023-06-15T19:53:31.404Z',
        __v: 0
        });
        done()
      })
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .get("/api/issues/fcc-project")
      .query({
        _id: "648b6c3b72943a229dc13f95",
        assigned_to: "Chai and Mocha",
        open: true
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.length, 1);
        done()
      })
    });
  })
  suite('PUT /api/issues/{project} => object with issue data', () => {
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .put("/api/issues/projects")
      .send({
        _id: "648b71300b7e3d344a5243c9",
        issue_title: "updated"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "648b71300b7e3d344a5243c9")
        done()
      })
    });
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .put("/api/issues/projects")
      .send({
        _id: "648b71d339cb2136c8280cd7",
        assigned_to: "Filled",
        issue_title: "Updated",
        issue_text: "Functional Test2",
        created_by: "Jonao",
        status_text: "Fine"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "648b71d339cb2136c8280cd7");
        done()
      })
    });
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .put("/api/issues/projects")
      .send({
        assigned_to: "Filled",
        issue_title: "Updated"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done()
      })
    })
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .put("/api/issues/projects")
      .send({
        _id: "648b71d439cb2136c8280cda"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent')
        done()
      })
    });
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .put("/api/issues/projects")
      .send({
        _id: "648b71d439cb2136c8283fcv",
        assigned_to: "Filled",
        issue_title: "Updated"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update")
        done()
      })
    });
  });
  suite('DELETE /api/issues/{project} => object with issue data', () => {
    
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .delete("/api/issues/projects")
      .send({
        _id: deleteID
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted')
        done()
      })
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .delete("/api/issues/projects")
      .send({
        _id: "648b71e5a2780e3742fvvva"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        done()
      })
    });
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
      chai.request(server)
      .keepOpen()
      .delete("/api/issues/projects")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id")
        done()
      })
    })
  })
});

after(function() {
  chai.request(server)
    .get('/')
});