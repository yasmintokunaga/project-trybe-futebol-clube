const user = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
    // senha: secret_admin
};

const userLogin = {
  email: 'admin@admin.com',
  password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
};

const validToken = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxfSwiaWF0IjoxNjk0Njk2NTY0fQ.lQaLFCpx3yB4VocrfEoX2ws44SFDob2diH5pLoBFFVM'
}

const users = [user];

export {
  user,
  users,
  userLogin,
  validToken,
};