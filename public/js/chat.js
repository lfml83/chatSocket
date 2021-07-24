// eslint-disable-next-line no-undef
const socket = io("http://localhost:3000");

function onLoad() {
  // eslint-disable-next-line no-undef
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");

  socket.emit("start", {
    email,
    name,
    avatar,
  });
}

onLoad();
