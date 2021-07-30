import { container } from "tsyringe";

import { io } from "../http";
import { CreateChatRoomService } from "../services/CreateChatRoomService";
import { CreateUserService } from "../services/CreateUserService";
import { GetAllUsersService } from "../services/GetAllUserService";
import { GetChatRoomByUserService } from "../services/GetChatRoomByUserService";
import { GetUserBySocketIdService } from "../services/GetUserBySockeIdService";

io.on("connect", (socket) => {
  socket.on("start", async (data) => {
    const { email, avatar, name } = data;
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      email,
      avatar,
      name,
      socket_id: socket.id,
    });
    // envia somente para todos os usuarios exceto quem esta logando
    socket.broadcast.emit("new_users", user);
  });
  socket.on("get_users", async (callback) => {
    const getAllUsersService = container.resolve(GetAllUsersService);
    const users = await getAllUsersService.execute();
    // callback para retorno em websocket
    callback(users);
  });

  socket.on("start_chat", async (data, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getChaRoomByUserService = container.resolve(GetChatRoomByUserService);
    const getUserBySocketIdService = container.resolve(
      GetUserBySocketIdService
    );

    const userLogged = await getUserBySocketIdService.execute(socket.id);

    let room = await getChaRoomByUserService.execute([
      data.idUser,
      // eslint-disable-next-line no-underscore-dangle
      userLogged._id,
    ]);

    if (!room) {
      room = await createChatRoomService.execute([
        data.idUser,
        // eslint-disable-next-line no-underscore-dangle
        userLogged._id,
      ]);
    }

    callback({ room });
  });
});
