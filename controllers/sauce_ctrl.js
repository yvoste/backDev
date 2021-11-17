/* jshint esversion: 10 */
/**
 *  Controller
 */
 const Sauce = require("../models/sauce_model");
 const fs = require("fs");
 require("dotenv").config();
 
 // logique des sauces sur les differentes routes
 
 const createSauce = async (req, res, next) => {  
   try {
     if(req.body.error == 1){
       const error = {
         "message":"User validation failed: Form Name : Only letter "
       };
       res.status(422).json(error);
   } else {   
       const sauceObject = JSON.parse(req.body.sauce);
       const sauce = new Sauce({
         ...sauceObject,
         imageUrl: req.file.filename,
       });
       await sauce.save();
       res.status(201).json({ message: "Objet enregistré !" });
     }
   }
   catch{
     console.log(error);
     if (error.name == 'ValidationError') {
       //console.error('Error Validating!', error);
       res.status(422).json(error);
     } else {
         //console.error(error);
         res.status(500).json(error);
     }
   }  
 };
 
 const getAllSauce = async (req, res, next) => {
   try{
     const sauces = await Sauce.find();
     sauces.forEach((sauce) => {
       sauce.imageUrl =  process.env.URL + process.env.DIR + sauce.imageUrl;
     });
     res.status(200).json(sauces);
   } 
   catch {
     res.status(400).json({ error })
   }
 };
 
 const getOneSauce = async (req, res, next) => {
   try{
     const sauce = await Sauce.findOne({ _id: req.params.id });
     sauce.imageUrl =  process.env.URL + process.env.DIR + sauce.imageUrl;
     res.status(200).json(sauce);
   }
   catch{
     res.status(404).json({ error });
   }
 };
 
 const modifySauce = async (req, res, next) => {
   try{
     const sauceObject = req.file ? {
                       ...JSON.parse(req.body.sauce),
                       imageUrl: req.file.filename,
                     } : { ...req.body };
     await Sauce.updateOne(
       { _id: req.params.id },
       { ...sauceObject, _id: req.params.id }
     );
     res.status(200).json({ message: "Objet modifié !" });
   } catch{
     res.status(400).json({ error });
   }
 };
 
 const deleteSauce = async (req, res, next) => {
   try{
     const sauce = await Sauce.findOne({ _id: req.params.id });
     const filename = sauce.imageUrl;
     fs.unlink(`images/${filename}`, async () => {
       await Sauce.deleteOne({ _id: req.params.id })
       res.status(200).json({ message: "Objet supprimé !" })
     });
   }
   catch (error){
     console.log(error.message)
     res.status(400).json({ error });
   }
 };
 
 
 const likeSauce = async (req, res) => {
  let sauce = await Sauce.findOne({ _id: req.params.id });
   try{ 
    if(sauce && sauce.userId === req.body.userId){
      res.status(200).json({ message: "You can't like  or dislike your sauces !" }); 
      // le créateur ne devrait pas pouvoir liké
    } else {
      console.log(sauce)    
      switch (req.body.like) {
        case 0:                                         //cas: req.body.like = 0
          //const sauce = await Sauce.findOne({ _id: req.params.id })
          if (sauce.usersLiked.find( user => user === req.body.userId)) {  
            // on cherche si l'utilisateur est déjà dans le tableau usersLiked
            await Sauce.updateOne({ _id: req.params.id }, {         // si oui, on va mettre à jour la sauce avec le _id présent dans la requête
              $inc: { likes: -1 },                            // on décrémente la valeur des likes de 1 (soit -1)
              $pull: { usersLiked: req.body.userId }          // on retire l'utilisateur du tableau.
            })
            res.status(201).json({ message: "vote enregistré."}); 
          }
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {  
            //mêmes principes que précédemment avec le tableau usersDisliked
            await Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            })
            res.status(201).json({ message: "vote enregistré." });
          }
          break;       
        case 1:                                                 //cas: req.body.like = 1
            await Sauce.updateOne({ _id: req.params.id }, {             // on recherche la sauce avec le _id présent dans la requête
              $inc: { likes: 1 },                                 // incrémentaton de la valeur de likes par 1.
              $push: { usersLiked: req.body.userId }              // on ajoute l'utilisateur dans le array usersLiked.
            })
            res.status(201).json({ message: "vote enregistré." });
          break;      
        case -1:                                                  //cas: req.body.like = 1
          await Sauce.updateOne({ _id: req.params.id }, {               // on recherche la sauce avec le _id présent dans la requête
            $inc: { dislikes: 1 },                                // on décremente de 1 la valeur de dislikes.
            $push: { usersDisliked: req.body.userId }             // on rajoute l'utilisateur à l'array usersDiliked.
          })
          res.status(201).json({ message: "vote enregistré." }); 
          break;
        default:
          res.status(400).json({ message: 'abd request'});
      }
    }
  }
  catch (error){
      console.log(error.message);
      res.status(400).json({ message: error.message})
  }
};

 module.exports = {
   createSauce,
   getAllSauce,
   getOneSauce,
   modifySauce,
   deleteSauce,
   likeSauce
 };
 
 