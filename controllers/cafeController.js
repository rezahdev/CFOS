const mongoose = require("mongoose");
const session = require("express-session");
const { Cafe } = require("../models/cafeModel");
const { MenuItem } = require("../models/menuItemModel");
const { DB } = require("../config/config");

const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";

async function index(req, res, next) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        console.log(cafe)
        if(cafe) {
            MenuItem.find({cafeId: cafe._id.toString()})
            .then(function(menuItems) {
                res.render("../views/cafe.njk", {
                    userLevel: 0,
                    cafe: cafe,
                    menuItems: menuItems
                });
            });
        }
        else {
            res.status(404).render("../public/404.html");
        }
    });
}

async function create(req, res) {
    res.render("../views/createCafe.njk", {
        _csrf: "TBI"
    });
}

async function insert(req, res, next) {
    let newCafe = new Cafe({
        name: req.body.name,
        location: req.body.location,
        Phone: req.body.phone,
        description: req.body.description,
        isOpen: (req.body.isOpen == "1")
    });

    await mongoose.connect(DB.uri);
    await newCafe.save(function(err) {
        if(err) throw err;
        else {
            res.redirect("/");
        }
    });

}

module.exports = {
    index,
    create, 
    insert
}