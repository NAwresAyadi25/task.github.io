const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");


const app = express();
app.use(cors());
app.use(express.json());

const CONNECTION_STRING = "mongodb://localhost:27017/api/";
const DATABASE_NAME = "api";

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get('/api/todoapp/GetNotes', (request, response) => {
  mongoose.connection.db.collection("todoappdb").find({}).toArray((error, result) => {
    if (error) {
      console.error("Error fetching notes:", error);
      response.status(500).json({ error: "Internal server error" });
    } else {
      response.json(result);
    }
  });
});

app.post('/api/todoapp/AddNotes', multer().none(), (request, response) => {
  mongoose.connection.db.collection("todoappdb").countDocuments((error, numOfDocs) => {
    if (error) {
      console.error("Error counting documents:", error);
      response.status(500).json({ error: "Internal server error" });
    } else {
      mongoose.connection.db.collection("todoappdb").insertOne({
        id: (numOfDocs + 1).toString(),
        description: request.body.newNotes
      }, (insertError) => {
        if (insertError) {
          console.error("Error adding note:", insertError);
          response.status(500).json({ error: "Internal server error" });
        } else {
          response.json("Added successfully");
        }
      });
    }
  });
});

app.delete('/api/todoapp/DeleteNotes', (request, response) => {
  const noteId = request.query.id;
  mongoose.connection.db.collection("todoappdb").deleteOne({ id: noteId }, (error) => {
    if (error) {
      console.error("Error deleting note:", error);
      response.status(500).json({ error: "Internal server error" });
    } else {
      response.json("Deleted successfully");
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
