const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const database = require("./connect");
const jwt = require("jsonwebtoken"); 
require('dotenv').config({ path: './config.env' });

let materialRoutes = express.Router();

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

// #1 Get all materials
materialRoutes.route("/materials").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("materials").find({}).toArray();
    response.json(data);
});

// #2 Get a single material
materialRoutes.route("/materials/:id").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("materials").findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
        response.json(data);
    } else {
        response.status(404).json({ message: "Material not found" });
    }
});

// #3 Create a new material
materialRoutes.route("/materials").post(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    // Check for duplicate name + spec combination
    let existingMaterial = await db.collection("materials").findOne({
        name: request.body.name,
        spec: request.body.spec
    });
    if (existingMaterial) {
        return response.status(400).json({ message: "A material with this exact name and specification already exists." });
    }

    let mongoObject = {
        name: request.body.name,
        spec: request.body.spec,
        weeklyRent: request.body.weeklyRent,
        dateAdded: new Date()
    };
    let data = await db.collection("materials").insertOne(mongoObject);
    response.json(data);
});

// #4 Update a material
materialRoutes.route("/materials/:id").put(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    // Check for duplicate name + spec combination excluding current material
    let existingMaterial = await db.collection("materials").findOne({
        name: request.body.name,
        spec: request.body.spec,
        _id: { $ne: new ObjectId(request.params.id) }
    });
    if (existingMaterial) {
        return response.status(400).json({ message: "Another material with this exact name and specification already exists." });
    }

    let mongoObject = {
        $set: {
            name: request.body.name,
            spec: request.body.spec,
            weeklyRent: request.body.weeklyRent
        }
    };
    let data = await db.collection("materials").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
});

// #5 Delete a material
materialRoutes.route("/materials/:id").delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("materials").deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
});

module.exports = materialRoutes;
