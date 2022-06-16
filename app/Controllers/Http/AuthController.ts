// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Hash from "@ioc:Adonis/Core/Hash";
import User from "App/Models/User";

export default class AuthController {

  public async register({request, response}: HttpContextContract){
    const {email, password, username}  = request.body()

    try{
      Logger.info('route:register')
      const user = new User()
      user.email = email
      user.username = username
      user.password = password
      user.is_active = false

      await user.save()

      response.created({
        statusCode:201,
        message: 'registrasi berhasil',
        data: user
      })
    }catch (e) {
      console.log(e.code)
      response.conflict({
        statusCode:409,
        message: e.sqlMessage,
        data: null
      })
    }

  }

  public async login({auth, request, response}: HttpContextContract){
    const { email, password } = request.body()

    const user = await User.query().where('email', email).where('is_active', true).firstOrFail()

    if(!(await Hash.verify(user.password, password))){
      response.badRequest('invalid credential')
    }

    const jwt = await auth.use("jwt").login(user)

    response.ok({
      statusCode: 200,
      message: 'Login berhasil',
      data: jwt,
    })
  }

  public async logout ({auth, response}: HttpContextContract){
    await auth.use('jwt').revoke()

    response.ok({
      message: 'Logout berhasil',
    })
  }

  public async refresh({auth, request, response}: HttpContextContract){
    const refreshToken = request.input("refresh_token")
    Logger.info(refreshToken)

    const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)

    response.accepted({data: jwt})
  }
}
