// eslint-disable-next-line no-undef
const socket = io("http://localhost:3000");

socket.on("chat_iniciado", (data) => {
  console.log(data);
});
