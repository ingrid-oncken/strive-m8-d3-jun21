import jwt from "jsonwebtoken"

export const JWTAuthenticate = async user => {
  // given the user the function gives us back the access token
  const accessToken = await generateJWT({ _id: user._id })

  return accessToken
}

const generateJWT = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err)
      else resolve(token)
    })
  )

// generateJWT({})
//   .then(token => console.log(token))
//   .catch(err => console.log(err))

// const token = await generateJWT({})