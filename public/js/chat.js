// eslint-disable-next-line no-undef
const socket = io("http://localhost:3000");
let idChatRoom = "";

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

  socket.on("message", (data) => {
    console.log("message", data);
    // eslint-disable-next-line no-use-before-define
    addMessage(data);
  });
}
function addMessage(data) {
  const divMessageUser = document.getElementById("message_user");

  divMessageUser.innerHTML += `
  <span class="user_name user_name_date">
      <img
        class="img_user"
        src=${data.user.avatar}
      />
      <strong>${data.user.name}</strong>
      <span> ${dayjs(data.message.created_at).format(
        "DD/MM/YYYY HH:mm"
      )}</span></span
    >
    <div class="messages">
      <span class="chat_message">${data.message.text}</span>
    </div>
  `;
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

    socket.emit("start_chat", { idUser }, (response) => {
      // eslint-disable-next-line no-const-assign
      idChatRoom = response.room.idChatRoom;

      response.messages.forEach((message) => {
        const data = {
          message,
          user: message.to,
        };
        addMessage(data);
      });
    });
  }
});
// se ele clicar
document.getElementById("user_message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const message = e.target.value; // pegando o que esta escrito no input

    console.log("message", message);

    e.target.value = ""; // limpa a mensagem no input

    const data = {
      message,
      idChatRoom,
    };

    socket.emit("message", data);
  }
});
onLoad();
