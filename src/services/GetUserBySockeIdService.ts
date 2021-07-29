import { User } from "../schemas/User";

class GetUserBySocketIdService {
  async execute(socket_id: string): Promise<User> {
    const user = await User.findOne({
      socket_id,
    });
    return user;
  }
}

export { GetUserBySocketIdService };
