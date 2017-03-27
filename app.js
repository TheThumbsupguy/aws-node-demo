const AWS = require('aws-sdk');
const uuid = require('node-uuid');
const express = require('express');
const formidable = require('express-formidable');

AWS.config.update({
  region: "us-west-2"
  //endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();

//middleware
app.use(formidable());

// Get orders
app.get('/orders', function(req, res){
  docClient.scan({ TableName:"Orders"}, function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data.Items);
    }
  });
});

// Post order
app.post('/orders', function(req, res) {
  const params = {
    TableName:'Orders',
    Item: {
      orderId: uuid.v1(),
      orderName: 'Test Order'  
    }
  };
  docClient.put(params, function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({
        orderId: params.Item.orderId,
        orderName: params.Item.orderName
      });
    }
  });
});

// Update order
app.put('/orders/:orderId', function(req, res) {
  const params = {
    TableName:'Orders',
    Key: {
      orderId: req.params.orderId
    },
    UpdateExpression: 'set orderName = :name',
    ExpressionAttributeValues: {
      ':name' : req.fields.orderName
    }
  };  

  docClient.update(params, function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({
        orderId: params.Key.orderId,
        orderName: req.fields.orderName
      });
    }
  });
});

// Delete order
app.delete('/orders/:orderId', function(req, res) {
  const params = {
    TableName:'Orders',
    Key: {
      orderId: req.params.orderId
    }
  };
  docClient.delete(params, function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({
        orderId: params.Key.orderId
      });
    }
  });
});

app.listen(3000);