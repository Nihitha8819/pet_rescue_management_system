db.createUser({
  user: "petrescueUser",
  pwd: "securePassword123",
  roles: [
    { role: "readWrite", db: "petrescueDB" }
  ]
});

db = db.getSiblingDB("petrescueDB");

db.createCollection("users");
db.createCollection("pets");
db.createCollection("rescues");
db.createCollection("matches");
db.createCollection("notifications");

db.users.insertMany([
  { email: "admin@petrescue.com", password: "adminPassword", user_type: "admin", is_verified: true, created_at: new Date(), updated_at: new Date() }
]);

db.pets.insertMany([
  { name: "Buddy", type: "Dog", breed: "Golden Retriever", color: "Golden", gender: "Male", size: "Large", age: 3, description: "Friendly and playful", status: "available", location: "New York", images: [], created_by: "admin@petrescue.com", created_at: new Date(), updated_at: new Date() }
]);

db.rescues.insertMany([]);
db.matches.insertMany([]);
db.notifications.insertMany([]);