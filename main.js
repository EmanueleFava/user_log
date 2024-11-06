const body = document.querySelector("body");

class ModelUser {
  constructor(username, surname, email, password) {
    this.username = username;
    this.surname = surname;
    this.id = `${this.username[0]}${this.surname[0]}${
      this.surname[1]
    }${Math.floor(Math.random() * 100000)}`;
    this.email = email;
    this.password = password;
    this.dataIscrizione = new Date();
  }
}

class ControllerUser {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("users")) || [];
  }

  createUser(username, surname, email, password) {
    const user = new ModelUser(username, surname, email, password);
    console.log(`User ${user.username} creato con successo`);
    this.users.push(user);
    localStorage.setItem("users", JSON.stringify(this.users));
    return user;
  }

  getUser(username, password) {
    function getUsername(element) {
      if (element.username === username && element.password === password) {
        console.log("User trovato");
        return true;
      } else return false;
    }

    const userFound = this.users.find(getUsername);
    console.log(userFound);
    return userFound;

    // return this.users.find((user) => user.username === username);
  }

  readUser(id) {
    function searchUser(element) {
      if (element.id === id) {
        console.log("found");
        return true;
      } else {
        console.log("not found");
        return false;
      }
    }
    const userFound = this.users.find(searchUser);
    return userFound;
  }

  updateUsername(id, newUsername) {
    const userFound = this.readUser(id);
    if (userFound) {
      userFound.username = newUsername;
      console.log(`Utente aggiornato: ${userFound.username}`);
      console.log(userFound);
      localStorage.setItem("users", JSON.stringify(this.users));
    } else {
      console.log("User non trovato");
    }
  }

  updateEmail(id, newEmail) {
    const userFound = this.readUser(id);
    if (userFound) {
      userFound.email = newEmail;
      console.log(`Utente aggiornato: ${userFound.username},
nuova email: ${userFound.email}`);
      console.log(userFound);
      localStorage.setItem("users", JSON.stringify(this.users));
    } else {
      console.log("User non trovato");
    }
  }

  updatePassword(id, newPassword) {
    if (newPassword.length <= 4) {
      console.log("Inserisci una Password con più di 4 caratteri");
      alert("Inserisci una Password con più di 4 caratteri");
    } else {
      const userFound = this.readUser(id);
      if (userFound) {
        userFound.password = newPassword;
        console.log(`Utente aggiornato: ${userFound.username},
    nuova password: ${userFound.password}`);
        console.log(userFound);
        localStorage.setItem("users", JSON.stringify(this.users));
      } else {
        console.log("User non trovato");
      }
    }
  }

  deleteUser(id) {
    function filterUser(element) {
      if (element.id != id) {
        return element;
      }
    }
    this.users = this.users.filter(filterUser);
  }
}

const controllerUser = new ControllerUser();
let user = null;
let userLogged = null;

document.addEventListener("DOMContentLoaded", () => {
  userLogged = localStorage.getItem("userLogged");
  user = JSON.parse(userLogged);

  if (user) {
    renderLoggedIn(user);
  } else {
    renderForm();
  }
});

function renderForm() {
  body.innerHTML = `
    <form id="form-user">
      <label for="username">Username</label>
      <input type="text" id="username" />
      <label for="surname">Nome e Cognome</label>
      <input type="text" id="surname" />
      <label for="email">Email</label>
      <input type="email" id="email" />
      <label for="password">Password</label>
      <input type="password" id="password" />
      <button type="submit" id="btn-submit">Register</button>
    </form>
    <form id="form-login">
      <label for="username-login">Username</label>
      <input type="text" id="username-login" />
      <label for="password-login">Password</label>
      <input type="password" id="password-login" />
      <button type="submit" id="btn-submit">Login</button>
    </form>
  `;

  const form = document.getElementById("form-user");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (password.length <= 4) {
      alert("Inserire più di 4 caratteri per la password");
      return;
    }

    const newUser = controllerUser.createUser(
      username,
      surname,
      email,
      password
    );
    localStorage.setItem("userLogged", JSON.stringify(newUser));
    renderLoggedIn(newUser);
  });

  const formLogin = document.getElementById("form-login");
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username-login").value;
    const password = document.getElementById("password-login").value;
    const loggedUser = controllerUser.getUser(username, password);
    renderLoggedIn(loggedUser);
    localStorage.setItem("userLogged", JSON.stringify(loggedUser));
  });
}

function renderLoggedIn(user) {
  body.innerHTML = `
    <div class="container-form" id="form-container">    
        <h2><strong>${user.username}</strong> is Logged In!</h2>
        <h3>Dati utente: </h3>
        <p><strong>id: </strong> ${user.id}</p>
        <p><strong>username: </strong>${user.username}</p>
        <p><strong>email: </strong>${user.email}</p>
        <p><strong>password: </strong>${user.password}</p>
        <div class="container"><button id="btn-logout">Logout</button>
        <button id="btn-updt-username">Change Username</button>
        <button id="btn-updt-email">Change Email</button>
        <button id="btn-updt-password">Change Password</button></div>
    </div>`;

  const formContainer = document.getElementById("form-container");
  const btnLogOut = document.getElementById("btn-logout");
  const btnUpUsername = document.getElementById("btn-updt-username");
  const btnUpEmail = document.getElementById("btn-updt-email");
  const btnUpPassowrd = document.getElementById("btn-updt-password");

  btnLogOut.addEventListener("click", () => {
    localStorage.removeItem("userLogged");
    user = null;
    renderForm();
  });

  btnUpUsername.addEventListener("click", () => {
    const inputUsername = document.createElement("div");
    inputUsername.innerHTML = `<label for="username">New Username</label>
      <input type="text" id="usernameUp" />
      <button id="btn-confirm-username">Confirm</button>`;
    formContainer.appendChild(inputUsername);
    const btnConfirm = document.getElementById("btn-confirm-username");

    btnConfirm.addEventListener("click", () => {
      const username = document.getElementById("usernameUp").value;
      console.log(user.id);
      console.log(controllerUser.users);
      console.log(username);
      controllerUser.updateUsername(user.id, username);
      const updateUserLogged = JSON.parse(localStorage.getItem("userLogged"));
      updateUserLogged.username = username;
      localStorage.setItem("userLogged", JSON.stringify(updateUserLogged));
      renderLoggedIn(updateUserLogged);
    });
  });

  btnUpEmail.addEventListener("click", () => {
    const inputEmail = document.createElement("div");
    inputEmail.innerHTML = `<label for="emailUp">New Email</label>
      <input type="email" id="emailUp" />
      <button id="btn-confirm-email">Confirm</button>`;
    formContainer.appendChild(inputEmail);
    const btnConfirm = document.getElementById("btn-confirm-email");

    btnConfirm.addEventListener("click", () => {
      const email = document.getElementById("emailUp").value;
      console.log(user.id);
      console.log(controllerUser.users);
      console.log(email);
      controllerUser.updateEmail(user.id, email);
      const updateUserLogged = JSON.parse(localStorage.getItem("userLogged"));
      updateUserLogged.email = email;
      localStorage.setItem("userLogged", JSON.stringify(updateUserLogged));
      renderLoggedIn(updateUserLogged);
    });
  });

  btnUpPassowrd.addEventListener("click", () => {
    const inputPassword = document.createElement("div");
    inputPassword.innerHTML = `<label for="passwordUp">New Passowrd</label>
      <input type="text" id="passwordUp" />
      <button id="btn-confirm-password">Confirm</button>`;
    formContainer.appendChild(inputPassword);
    const btnConfirm = document.getElementById("btn-confirm-password");

    btnConfirm.addEventListener("click", () => {
      const password = document.getElementById("passwordUp").value;
      if (password.length <= 4) {
        alert("Inserisci nuovamente i parametri");
      } else {
        console.log(user.id);
        console.log(controllerUser.users);
        console.log(password);
        controllerUser.updatePassword(user.id, password);
        const updateUserLogged = JSON.parse(localStorage.getItem("userLogged"));
        updateUserLogged.password = password;
        localStorage.setItem("userLogged", JSON.stringify(updateUserLogged));
        renderLoggedIn(updateUserLogged);
      }
    });
  });
}
