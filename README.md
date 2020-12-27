#### Shopify Challenge for the Backend Developer Position (2020)

Candidate: Clara Chick (https://clarachick.me/)

#### Dependencies and Technologies:

- node (v15.4.0)
- npm (v7.0.15)

- MongoDB

Install before use: `npm i mongoose mongoose-gridfs gridfs-stream multer express node dotenv cors`

**The Task**: build an image repository. 

#### **Solution**:

Because this was an open ended task, I decided to get started on an idea I've had for a while: Remémorer.

The goal of this project is to create a full-stack app to allow users to upload happy memories and accomplishments and reminisce whenever they are feeling a bit down or just a bit lost.

Since this is a backend position, I will only be showcasing the backend for this project.

The two ideas I chose were:

ADD and  DELETE image(s).

#### Usage:

Account management:

1. create an account

**Endpoint:** 

`GET` `http://localhost:7000/api/user/`

JSON Body:

```json
{
    "_id": "some id",
    "password": "some password"
}
```

`Returns`: user _id

2. upload some files

**Endpoint:** 

`POST` `http://localhost:7000/api/files/upload/`

Form Data:

```json
"files": [{array of files}]
"desc": "description of the images"
```

`Returns`: user 

3. get some random file id to reminisce about 

**Endpoint:** 

`GET` `http://localhost:7000/api/files/random/:id`

`id`: user _id

`Returns`: image id that user _id uploaded

**Endpoint:** 

`GET` `http://localhost:7000/api/files/get/:id`

`id`: fileid

`Returns`: file

<hr/>

##### Add image(s) to the repository.

- [one / bulk / enormous amount of images](https://github.com/KohinaTheCat/Rememorer-Shopify-Backend-Developer-Challenge/blob/master/backend/routes/files.js#L57)

`upload.any()` - can upload any amount of files at once

- [private or public (permissions)](https://github.com/KohinaTheCat/Rememorer-Shopify-Backend-Developer-Challenge/blob/master/routes/user.js#L28)

(as a full-stack app) the user must login before they can access images attached to their account. As displayed in the link above, the password of the account is salted and hashed. 

- [secure uploading and stored images](https://github.com/KohinaTheCat/Rememorer-Shopify-Backend-Developer-Challenge/blob/master/.env)

For this challenge, I didn't add `.env` to the `.gitignore`, but typically the database URI is to be kept secret to ensure security. 

##### DELETE image(s)

- [one / bulk / selected / all images]()

When a user decides to delete their account, their images are deleted too.

You can delete individual files for an account.

- Prevent a user deleting images from another user (access control)

(as a full-stack app) the user is meant to login

(as an API) add password verification (see [here](https://github.com/KohinaTheCat/Rememorer-Shopify-Backend-Developer-Challenge/blob/master/routes/user.js#L28))

- secure deletion of images

I trust Mongo :heart:

<hr/>

:sob:

<img width="100%" src="./_imgs/home.PNG"/>

<img width="100%" src="./_imgs/upload.PNG" />