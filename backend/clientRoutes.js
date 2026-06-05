const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const database = require("./connect");
const jwt = require("jsonwebtoken"); 
require('dotenv').config({ path: './config.env' });

let clientRoutes = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

// Login Admin
clientRoutes.route("/admin/login").post(async (request, response) => {
    if (request.body.email === ADMIN_EMAIL && request.body.password === ADMIN_PASSWORD) {
        const token = jwt.sign({ email: ADMIN_EMAIL, role: "admin" }, process.env.SECRETKEY, { expiresIn: "12h" });
        response.json({ success: true, message: "Admin logged in successfully", token });
    } else {
        response.json({ success: false, message: "Invalid credentials" });
    }
});

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

// #1 Get all clients
clientRoutes.route("/clients").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").find({}).toArray();
    response.json(data);
});

// #2 Get a single client
clientRoutes.route("/clients/:id").get(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").findOne({ _id: new ObjectId(request.params.id) });
    if (data) {
        response.json(data);
    } else {
        response.status(404).json({ message: "Client not found" });
    }
});

// #3 Create a new client
clientRoutes.route("/clients").post(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    // Check for duplicate name + nickname combination
    let existingClient = await db.collection("users").findOne({
        name: request.body.name,
        nickname: request.body.nickname
    });
    if (existingClient) {
        return response.status(400).json({ message: "A client with this exact name and nickname already exists." });
    }

    let mongoObject = {
        name: request.body.name,
        email: request.body.email,
        phone: request.body.phone,
        address: request.body.address,
        nickname: request.body.nickname,
        dateAdded: new Date()
    };
    let data = await db.collection("users").insertOne(mongoObject);
    response.json(data);
});

// #4 Update a client
clientRoutes.route("/clients/:id").put(verifyToken, async (request, response) => {
    let db = database.getDb();
    
    // Check for duplicate name + nickname combination excluding current client
    let existingClient = await db.collection("users").findOne({
        name: request.body.name,
        nickname: request.body.nickname,
        _id: { $ne: new ObjectId(request.params.id) }
    });
    if (existingClient) {
        return response.status(400).json({ message: "Another client with this exact name and nickname already exists." });
    }

    let mongoObject = {
        $set: {
            name: request.body.name,
            email: request.body.email,
            phone: request.body.phone,
            address: request.body.address,
            nickname: request.body.nickname
        }
    };
    let data = await db.collection("users").updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
    response.json(data);
});

// #5 Delete a client
clientRoutes.route("/clients/:id").delete(verifyToken, async (request, response) => {
    let db = database.getDb();
    let data = await db.collection("users").deleteOne({ _id: new ObjectId(request.params.id) });
    response.json(data);
});

module.exports = clientRoutes;
