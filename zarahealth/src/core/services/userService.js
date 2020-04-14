import { BehaviorSubject } from "rxjs";

const userService = {
  login,
  logout,
  register,
  get currentUserValue () { return currentUserSubject.value },
  get someoneLoggedIn () { console.log(currentUserSubject.value); return currentUserSubject.value !== null } 
};

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

function login(username, password) {
  let user = null;
  localStorage.setItem("currentUser", JSON.stringify(user));
  currentUserSubject.next(user);
}

function logout() {
  localStorage.removeItem("currentUser");
  currentUserSubject.next(null);
}

function register(username, password) {}

export default userService