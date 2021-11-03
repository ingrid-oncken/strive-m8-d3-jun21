import express from "express"
import createHttpError from "http-errors"

import UserModel from "./schema.js"
import { basicAuthMiddleware } from "../auth/basic.js"
import { adminOnlyMiddleware } from "../auth/admin.js"
import { JWTAuthenticate } from "../auth/tools.js"

const usersRouter = express.Router()

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()
    res.send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user)
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    req.user.name = "John"
    await req.user.save()

    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()

    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const users = await UserModel.findById(req.params.id)
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Get email and password from req.body
    const { email, password } = req.body

    // 2. Verify credentials
    const user = await UserModel.checkCredentials(email, password)

    if (user) {
      // 3. If credentials are ok we are going to generate an access token
      const accessToken = await JWTAuthenticate(user)

      // 4. Send token back as a response
      res.send({ accessToken })
    } else {
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
