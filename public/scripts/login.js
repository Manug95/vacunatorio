import { setInvalidInputStyle, setValidInputStyle } from "./validaciones.js";
import { getElementById, mostrarMensaje } from "./frontUtils.js";
import { enviarPOST } from "./httpRequests.js";


document.addEventListener("DOMContentLoaded", () => {
  getElementById("password").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      login();
    }
  });

  getElementById("btn-login").addEventListener("click", login);
});

async function login() {
  try {
    const username = getElementById("username").value;
    const password = getElementById("password").value;

    if (isValidUsername(username) && isValidPassword(password)) {
      // const res = await enviarPOST("/usuarios/authenticate", { username, password });
      // mostrarMensaje(res.ok, res.mensaje);
      const response = await fetch("/usuarios/authenticate", {
        body: JSON.stringify({ username, password }),
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        mostrarMensaje(response.ok, res?.mensaje);
      }
    }

  } catch (error) {
    console.log(error);
  }
}

function isValidPassword(password) {
  let isValid = true;

  if (!password) {
    setInvalidInputStyle("password");
    isValid = isValid && false;
    return isValid;
  }

  if (password.length < 6 || password.length > 25) {
    setInvalidInputStyle("password");
    isValid = isValid && false;
  } else {
    setValidInputStyle("password");
    isValid = isValid && true;
  }

  return isValid;
}

function isValidUsername(username) {
  let isValid = true;

  if (!username) {
    setInvalidInputStyle("username");
    isValid = isValid && false;
    return isValid;
  }

  if (username.length < 1 || username.length > 16) {
    setInvalidInputStyle("username");
    isValid = isValid && false;
  } else {
    setValidInputStyle("username");
    isValid = isValid && true;
  }

  return isValid;
}