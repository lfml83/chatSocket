// eslint-disable-next-line no-undef
const socket = io("http://localhost:3000");
let roomId = "";

function onLoad() {
  // eslint-disable-next-line no-undef
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");

  // eslint-disable-next-line no-undef
  document.querySelector(".user_logged").innerHTML += `
  <img
    class="avatar_user_logged"
    src=${avatar}
  />
<strong id="user_logged">${name}</strong>
  `;

  socket.emit("start", {
    email,
    name,
    avatar,
  });

  socket.on("new_users", (data) => {
    const existInDiv = document.getElementById(`user_${data._id}`);

    if (!existInDiv) {
      // eslint-disable-next-line no-use-before-define
      addUser(data);
    }
  });
  socket.emit("get_users", (users) => {
    console.log("getUsers", users);
    users.map((user) => {
      if (user.email !== email) {
        addUser(user);
      }
    });
  });
}

function addUser(user) {
  // eslint-disable-next-line no-undef
  const usersList = document.getElementById("users_list");
  usersList.innerHTML += `
  <li
    class="user_name_list"
    id="user_${user._id}"
    idUser="${user._id}"
  >
    <img
      class="nav_avatar"
      src=${user.avatar}
    />
    ${user.name}
</li>`;
}

// eslint-disable-next-line no-undef
document.getElementById("users_list").addEventListener("click", (e) => {
  if (e.target && e.target.matches("li.user_name_list")) {
    const idUser = e.target.getAttribute("idUser");
    console.log("idUser", idUser);

    socket.emit("start_chat", { idUser }, (data) => {
      console.log(data);
      // eslint-disable-next-line no-const-assign
      roomId = data.room.idChatRoom;
    });
  }
});
onLoad();
