const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');
const { quantity } = require('../../../models/transaction-schema');


async function getUsers(pageNumber, pageSize, search, sort) {
  const users = await usersRepository.getUsers();

  let filter = users;
  if (search) {
    const [field, substring] = search.split(':');
    const searchKey = substring.toLowerCase();
    if (field === 'email') {
      filter = users.filter((user) =>
        user.email.toLowerCase().includes(searchKey)
      );
    } else if (field === 'name') {
      filter = users.filter((user) =>
        user.name.toLowerCase().includes(searchKey)
      );
    }
  }
  let sortField = 'email';
  let sortOrder = 1;
  if (sort) {
    const [field, order] = sort.split(':');
    sortField = field;
    sortOrder = order === 'desc' ? -1 : 1; // Mengubah "asc" menjadi 1 dan "desc" menjadi -1
  }
  

  // Sorting the filteredUsers
  filter.sort((a, b) => {
    const aValue = a[sortField].toLowerCase();
    const bValue = b[sortField].toLowerCase();
    if (sortField === 'email') {
      for (let i = 0; i < Math.min(aValue.length, bValue.length); i++) {
        if (aValue.charCodeAt(i) !== bValue.charCodeAt(i)) {
          return sortOrder * (bValue.charCodeAt(i) - aValue.charCodeAt(i));
        }
      }
      // Jika kedua nilai sama hingga akhir, urutkan berdasarkan panjang email
      return sortOrder * (bValue.length - aValue.length);
    } else {
      // Untuk kolom lain, gunakan pengurutan default
      if (aValue < bValue) return sortOrder === 1 ? -1 : 1;
      if (aValue > bValue) return sortOrder === 1 ? 1 : -1;
      return 0;
    }
  });

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filter.slice(startIndex, endIndex);

  const formattedUsers = paginatedUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: paginatedUsers.length,
    total_pages: Math.ceil(filter.length / pageSize),
    has_previous_page: pageNumber > 1,
    has_next_page: endIndex < filter.length,
    data: formattedUsers,
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}



/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

// API E_COMMERCE

// /**
//  * Create new user
//  * @param {string} name - Name
//  * @param {string} email - Email
//  * @param {string} password - Password
//  * @returns {boolean}
//  */
// async function createTransaction(product, description, price, quantitiy) {
//   try {
//     await usersRepository.createTransaction(product, description, price, quantitiy);
//   } catch (err) {
//     return null;
//   }

//   return true;
// }
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  // createTransaction
};
