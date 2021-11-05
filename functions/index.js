const functions = require("firebase-functions");
const express = require('express');
const admin = require('firebase-admin');
var stream = require('stream');
const crypto = require('crypto');


// 
//
const app = express();
//
//

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "keola-push2",
    "private_key_id": "620076d22b6dd768e724291c806fc8dab9775eec",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaWWwSymm6D8Ll\nl7aJnnjNLb5ZhP662HPRigJCezPxoE1CgZ/eCWxD0ze/jFfFbMQToG9R+R8Ob7Mj\ne47sPtH0mbSmSuwO76O2NHmOG+DyAjyVJjfrnDzUKqrec/rMSk/q0SRTX5nPU5vI\nWm1QKVtQcXoqc2YaOVyg2o5P7xuFkmD08IK9g5E3on9TRIwqHITUB/mCjv2FEMoN\nkzap7s7LAKJ18vd17WUgyELnOxO10FUe6OIzV8soQC1jdWG9Jgy64bcHpxGmgoL6\nijINwmtGhLJE8nrTyQFfmPIzBPzVYQyvadFLJGfJ1IR6Mn7cqJpMfBZ4xM8ZqbOG\nqrDsmDjpAgMBAAECggEAHMaeLJfKeT/sgo+M+fQNnZTCuk+BtqQiF2Jly9cq0FQ8\n+l/U7tE1GHc0qKTZSGZ+LMv+/8GiKyfjZvC4tD/PMbo0CZpkI8/HNpMR1f2slphe\n3ZUs13s+tQNug2Srj9LXV236qJY30hAFvtDUCTV6GE7sN73/ncMjhvtmt/geG2sh\n0D+Yye+kAvlfgeZQcK1sJUy/wf2f1U6pk/4KHLu6XGXpBcP29I/1ArVVMZ8DEeMk\nfwgiEdf/VlluLwJprydFWywSRBIRxzUL9Cl4T3tTmTRvglc0REStSn4IphwBisyC\n4cXXitM9BZlNwNT7qOVzYTrFIN5bd4WnRbp1X7cBEQKBgQDyIfypCXlR09RXG5Qn\nYFrVU8FGr6oKm2nK26mXVTv6D6HpM3Drz/b8CDdg5xMcV60nAvBTnTncFm0482WY\nwDE1WUlgmyXlDSWci91dbF6Fd8Kp/txQvN+C7/kYwOA8FtvS+jz+MUQhj3hmODcv\ndUl7ZsfwAeV8IhoHfoz0RX8fRQKBgQDm2rxVbyTlPJSNbgY4iTR04a0St3dQ5yXb\n7wbQijQO6U3JbFSOdpm9OVZn+XOOpyJeVAfv5Rr26fcZiKy80adgiqnP6eayB6Dr\nQegB6/IEy5Xgl7GbmK1lroK9IrBtMe/KV5SVqtn3LuEpTzV6kCcfaR9oEXW1BPwK\nqSDRAp1rVQKBgH4zNKst4uvBSpU0LJ3xXKZ/huc+u5PXuOYgY14a8K2+5BbV1u8x\nb3uhFKwPBCjrkbYZlAUgl32cusTKJ5Pb6En0BYiylKezmHzlcTU2PHW4G9/alB4I\nsz5dsSkzrivjhiOKhau/JdGQI6Kzfh/gM7J7uY3gjymJ5KMvVGwkpMM5AoGAKsJ7\nPevfTqKg9W1as6AeWkPu1dervw2BgrJMddYTfGuUX+mz48tuAJGdQpb+435rrEMu\nUS4Dh5agkVcyf6rpsMUeXQd7FqC5GrpTaf+1DVRUR4xxdluaSoo/Zx8ExMUKIFWG\njQ5fXxyM0iT8x93pkTTcf180iToKIUNgc7ZjSB0CgYEA236CO6JeoPO5mlHomt06\n2PBxFjOgk88OC2+9Hy8VuXY7ssAypihYUkHy9c9WfixjX/mA24Qgk9IYMPFFttmX\nS/aBjQiZIucai3RBikRjnTPhiv/D0KZhcZ+K5AR1az5rjpcAUpO8L8NCrsg6lMUP\nJFdd9lslb5WbSvLHpkiZmsg=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-42rm3@keola-push2.iam.gserviceaccount.com",
    "client_id": "107231662152040766479",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-42rm3%40keola-push2.iam.gserviceaccount.com",
    storageBucket: "keola-push2.appspot.com",
  }),
  databaseURL: "https://keola-push2-default-rtdb.firebaseio.com",
  storageBucket: "keola-push2.appspot.com",
})


const db = admin.firestore()
var bucket = admin.storage().bucket();
var storage = admin.storage()



app.get('/hello_world', (req, res) => {

  res.json({ message: 'hello_worolldd' })
})




// GET ALL  POSTS  ********************************************* photoBase64
app.get("/socialApi/posts", async (req, res) => {

  const col = db.collection('social_posts')
  const querSnapShot = await col.limit(30).orderBy('updateDate', 'desc').get()
  const docs = querSnapShot.docs
  const response = docs.map(item => ({
    id: item.id,
    ...item.data()

  }))


  return res.status(200).json({ objModel: response });
  try {
    const allPosts = db.collection('social_posts').get();
    return res.json(allPosts);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
})


// UPLOAD  POST  ********************************************* photoBase64
const {
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');
fs = require('fs');
app.post("/socialApi/post", async (req, res) => {

  const hash_name_image = crypto.randomBytes(8).toString('hex') + '.jpg'

  console.log("--resp    wirte  okokok 2 2222")

  const metadata = {
    firebaseStorageDownloadTokens: uuidv4(),
  }

  let bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer.from(req.body.photoBase64, 'base64'));
  let file = bucket.file(`social_posts/${hash_name_image}`);
  bufferStream.pipe(file.createWriteStream({
    metadata: {
      contentType: 'image/jpeg'
    }
  }))
    .on('error', error => {
      reject(`news.provider#uploadPicture - Error while uploading picture ${JSON.stringify(error)}`);
    })
    .on('finish', (file) => {
      // The file upload is complete.
      console.log("news.provider#uploadPicture - Image successfully uploaded: !!!!!!!!! ");

      try {

        const url_options = {
          version: "v4",
          action: "read",
          expires: Date.now() + 1000 * 60 * 60 * 24 * 6
        }
        const urrrr = bucket.file("social_posts/" + hash_name_image).getSignedUrl(url_options).then(async (url) => {
          console.log("mani magico  ---> ", url[0]);
          const noww = Math.floor(Date.now() / 1000)
          // try {
          await db.collection('social_posts').doc().create({
            idUser: req.body.idUser,
            img_user: req.body.img_user,
            name_user: req.body.name_user,
            comment: req.body.comment,
            img_post: url[0],
            total_reactions: 0,
            last_reacter_id: 0,
            r_like: 0,
            r_love: 0,
            r_fun: 0,
            r_angry: 0,
            r_hungry: 0,
            r_motivate: 0,
            updateDate: noww,
            img_post_name: hash_name_image,
          });

        })

        console.log("XDXDXDXD")
        return res.json({ msg: `todo ok ---> ${hash_name_image}` });
      } catch (error) {
        console.log("ERROR  JOSH ", error)
        return res.status(500).send(error);
      }


    });


})


// UPDATE REACTION POST  ****************************************************************O
app.put("/socialApi/post_reaction", async (req, res) => {
  try {
    const doc = db.collection("social_posts").doc(req.body.id_post);
    doc.update({
      total_reactions: admin.firestore.FieldValue.increment(1),
      [req.body.type_reaction]: admin.firestore.FieldValue.increment(1),
      last_reacter_id: req.body.idUser
    })
    return res.json({ msg: `todo ok ---> ${req.body.id_post}` });
  } catch (error) {
    console.log("ERROR  JOSH ", error)
    return res.status(500).send(error);
  }
})

// UPDATE REACTION POST  ****************************************************************O
app.post("/socialApi/post_comment", async (req, res) => {
    const noww = Math.floor(Date.now() / 1000)
  try {
    const doc = db.collection("social_comments").doc()
    doc.create({
      idUser: req.body.idUser,
      comment: req.body.comment,
      img_user: req.body.img_user,
      name_user: req.body.name_user,
      id_post: req.body.id_post,
updateDate: noww

    })
    console.log("obj -- >", doc.id)
    return res.json({ msg: ` comment ok ---> ${doc.id}` });

  } catch (error) {
    console.log("ERROR  JOSH ", error)
    return res.status(500).send(error);
  }
})
// GET ALL COMMENTS POST ****************************************************************O

app.get("/socialApi/post_comments/:id_post", async (req, res) => {
  try {
    const col = db.collection("social_comments")
    const querysnap = await col.where("id_post", "==", req.params.id_post).get()
    const docs2 = querysnap.docs
    // const docs = await  db.collection("social_comments").where("id_post" ,"==" ,req.params.id_post).get().docs
    const response = docs2.map(item => ({
      id: item.id,
      ...item.data()

    }))

const resp = response.sort( function(a,b){

return b?.updateDate - a?.updateDate 
})

    return res.status(200).json({ objModel: resp });

  } catch (error) {
    console.log("ERROR  JOSH ", error)
    return res.status(500).send(error);
  }
})




const path = require("path");
app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./path/imagexdxd.jpg"));
});


exports.app = functions.https.onRequest(app);




