const express = require("express");

const req = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const { ObjectId } = require('mongodb'); //untuk mendapatkan _id

//middleware express
const app = express();

//middleware untuk mengirim form
app.use(bodyParser.urlencoded({extended : true}));

//view dari express js
app.set("view engine", "ejs");
app.set("views","views");


const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);


async function run(){
    try{
        //check connection to the database
        await client.connect();
        console.log("Connection established");

        //view database
        const db = await client.db('student');
        const coll = await db.collection('siswa');
        //end

        //Menampilkan data
        app.get("/",async(req,res)=>{
        let viewItem = await coll.find().toArray();
        const item = JSON.parse(JSON.stringify(viewItem));
        res.render('index', {siswa : item, title : "Crud Node js dengan MongoDB"});
        })
        //end

        //untuk tambah data.
        app.post("/tambah",async(req,res) => {
            const getItem = {nama : `${req.body.nama}` , kelas : `${req.body.kelas}`};
            let insertItem = await coll.insertOne(getItem);
            res.redirect("/");
        }           
        )
        //end tambah
        
        //untuk edit data.
        app.post("/edit/:_id", async(req , res) => {
            console.log("Edit route called");
            const itemId = { _id: new ObjectId(req.body.id) };
            console.log("ItemId:", itemId);
            
            const itemUpdate = {
                nama: `${req.body.nama}`,
                kelas: `${req.body.kelas}`,
                umur: `${req.body.umur}`
            };
            
            const itemUpdated = { $set: itemUpdate };
            
            try {
                let updated = await coll.updateOne(itemId, itemUpdated);
                console.log("Updated:", updated);
                res.redirect("/");
            } catch (error) {
                console.log(error.message);
            }
            
        })
        //end edit

        //Hapus
        app.get('/delete/:_id',async(req,res)=> {
            const itemDelete = {_id : new ObjectId(req.params._id) };

            try{
                const deleteRequest = await coll.deleteOne(itemDelete);
                res.redirect("/");
            }catch(error){
                console.log("gagal hapus", error.message);
            }
        })
        //end

        //mengantifkan port
        app.listen(27017, ()=>{
            console.log("Listening on port 27017");
        })
        //end



    }catch(error){
        console.log("Error masseh : ", error.message);
    }
}
    

// app.use(express.json()); 

run();

