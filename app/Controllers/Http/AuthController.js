'use strict'

const {validateAll} = use('Validator');
const User = use('App/Models/User');

class AuthController {
  async login({request, response, auth}) {
    let validator = await validateAll(request.all(), {
      'email': 'required|string|email',
      'password': 'required|string',
    });

    if (validator.fails()) {
      return response.status(422).json({
        success: false,
        'message': 'The given data was invalid.',
        'errors': validator.messages(),
      });
    }

    try {
      let token = await auth.attempt(request.body.email, request.body.password);

      return response.json({
        token_type: token['type'],
        access_token: token['token'],
      });
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'These credentials do not match our records.',
        errors:  {'username': ['These credentials do not match our records.']}
      });
    }
  };

  async register({request, response}) {
    let validator = await validateAll(request.all(), {
      'username': 'required|string|unique:users,username',
      'email': 'required|string|email|unique:users,email',
      'password': 'required|string',
    });

    if (validator.fails()) {
      return response.status(422).json({
        success: false,
        'message': 'The given data was invalid.',
        'errors': validator.messages(),
      });
    }

    try {
      await User.create({
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
      });

      return response.status(204).json({});
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Error 400: Bad request',
      });
    }
  };

  async account({response, auth}) {
    const user = await User.find(auth.user.id);
    
    response.json({data: auth.user})
  };
}

module.exports = AuthController
