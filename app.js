//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connection and create a database named todoListDB
mongoose.connect('mongodb+srv://pratyushdeveloper011:Raj12345@cluster1.xpcop0f.mongodb.net/todolistDB');

// Mongoose Schema
const itemsSchema = new mongoose.Schema({
  name : String
});

// Mongoose Model collection name should be singular like item not items
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item();
item1.name = "Welcome to your Todo List!";

const item2 = new Item();
item2.name = "Hit the + button to add a new Item.";

const item3 = new Item();
item3.name = "<-- Hit this to delete an item.";

const defaultItems = [item1, item2, item3];
// Item.insertMany(defaultItems);

const listSchema = new mongoose.Schema({
  name : String,
  items : [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {


  async function find() {
    try {
      const doc = await Item.find({});
      if(doc.length === 0) {
        Item.insertMany(defaultItems);
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: doc});
      }
    } finally {
      
    }
  }
  find().catch(console.dir);

});

// To use route parameters to create dynamic routes
app.get("/:customListName" , function(req,res) {

  const customListName = _.capitalize(req.params.customListName);
  

  async function findOne() {
    try {
      const doc = await List.find({name : customListName}).exec();
      if(doc.length === 0) {
        const list = new List();
        list.name = customListName;
        list.items = defaultItems;

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {listTitle: customListName, newListItems: doc[0].items})
      }
    } finally {
      
    }
  }
  findOne().catch(console.dir);

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item4 = new Item();
  item4.name = itemName;

  if(listName === "Today") {
    console.log("Hi");
  item4.save();
  res.redirect("/");
  } else {
    async function findOnep() {
      try {
        const doc = await List.find({name : listName}).exec();
        if(doc.length != 0) {
          
          const item5 = new Item();
          item5.name = itemName;
          doc[0].items.push(item5);
          doc[0].save();
          res.redirect("/" + listName);
        }
        else {

        }
      } finally {
        
      }
    }
    findOnep().catch(console.dir);
  }
});

app.post("/delete" , function(req,res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today")
  {
    async function DeleteMany() {
      try {
          const res = await Item.deleteMany({ _id : checkedItemId });
          console.log(res);
      } finally {
  
      }
  }
      DeleteMany().catch(console.dir);
    // Item.findOneAndDelete(checkedItemId);
    res.redirect("/");
  } else {
    // const q = List.findOneAndUpdate({condition},{$pull : {field : query}})
    async function findOned() {
      try {
      const checkedItemId = req.body.checkbox;

        const doc = await List.find({name : listName}).exec();
        var index = -1;
        if(doc.length != 0) {
          for(var i = 0 ; i < doc[0].items.length ; i++){
            if(doc[0].items[i]._id == checkedItemId)
            {
              index = i;
              break;
            }
          }
          doc[0].items.splice(index,1);
          doc[0].save();
          res.redirect("/" + listName);
          }
        else {

        }
      } finally {
        
      }
    }
    findOned().catch(console.dir);
  }


});



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
