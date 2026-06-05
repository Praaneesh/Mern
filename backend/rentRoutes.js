const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const database = require("./connect");
const jwt = require("jsonwebtoken"); 
require('dotenv').config({ path: './config.env' });

let rentRoutes = express.Router();

// Middleware to verify admin token
function verifyToken(request, response, next) {
    const authHeaders = request.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if (!token) {
        return response.status(401).json({ message: "Authentication token missing" });
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error || user.role !== "admin") {
            return response.status(403).json({ message: "Invalid or unauthorized token" });
        }
        request.user = user;
        next();
    });
}

// #1 Get all rents
rentRoutes.route("/rents").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("rents").find({}).sort({dateAdded: -1}).toArray();
    response.json(data);
});

// #2 Get a single rent
rentRoutes.route("/rents/:id").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("rents").findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
        response.json(data);
    } else {
        response.status(404).json({ message: "Rent not found" });
    }
});

// #2.5 Get rents by client ID
rentRoutes.route("/rents/client/:clientId").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("rents").find({ clientId: request.params.clientId }).sort({dateAdded: -1}).toArray();
    response.json(data);
});

// #3 Create a new rent
rentRoutes.route("/rents").post(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    // We don't need unique constraint for a single rent since one client can rent multiple times.
    
    let mongoObject = {
        clientId: request.body.clientId,
        clientName: request.body.clientName,
        materials: request.body.materials, // Array of { materialId, materialName, quantity, weeklyRent }
        totalCost: request.body.totalCost,
        weeks: request.body.weeks,
        dateAdded: request.body.startDate ? new Date(request.body.startDate) : new Date(),
        endDate: request.body.endDate ? new Date(request.body.endDate) : null
    };
    
    let data = await db.collection("rents").insertOne(mongoObject);
    response.json(data);
});

// #4 Update a rent
rentRoutes.route("/rents/:id").put(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    let mongoObject = {
        $set: {
            clientId: request.body.clientId,
            clientName: request.body.clientName,
            materials: request.body.materials,
            totalCost: request.body.totalCost,
            weeks: request.body.weeks,
            dateAdded: request.body.startDate ? new Date(request.body.startDate) : new Date(),
            endDate: request.body.endDate ? new Date(request.body.endDate) : null
        }
    };
    
    let data = await db.collection("rents").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
});

// #5 Delete a rent
rentRoutes.route("/rents/:id").delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("rents").deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
});

module.exports = rentRoutes;
