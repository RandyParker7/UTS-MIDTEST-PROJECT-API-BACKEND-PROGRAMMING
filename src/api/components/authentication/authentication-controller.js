
const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Object to store failed login attempts
const failedLoginAttempts = {};
const maxLoginAttempts = 5;
/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check if the user has exceeded the maximum login attempts
    if (failedLoginAttempts[email] >= maxLoginAttempts) {
      const remainingTime = calculateRemainingTime(email);
      if (remainingTime === 0) {
        resetFailedAttempts(email);
      } else {
        throw errorResponder(
          errorTypes.TOO_MANY_ATTEMPTS,
          `Too many login attempts. Please try again in ${remainingTime} minutes.`
        );
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Increment failed login attempts count
      failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;
      failedLoginAttempts[email + '_time'] = Date.now(); // Update last failed attempt time
      
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset failed login attempts on successful login
    delete failedLoginAttempts[email];

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

/**
 * @param {string} email 
 * @returns {number} 
 */
function calculateRemainingTime(email) {
  const lastFailedAttemptTime = failedLoginAttempts[email + '_time'] || 0;
  const currentTime = Date.now();
  const elapsedTime = currentTime - lastFailedAttemptTime;
  const remainingTimeInMilliseconds = 30 * 60 * 1000 - elapsedTime;
  const remainingTimeInMinutes = Math.ceil(remainingTimeInMilliseconds / (60 * 1000));
  return Math.max(0, remainingTimeInMinutes); 
}

/**
 * Reset failed login attempts for a user
 * @param {string} email - User's email address
 */
function resetFailedAttempts(email) {
  delete failedLoginAttempts[email];
  delete failedLoginAttempts[email + '_time'];
}

module.exports = {
  login,
};
