import { injectable } from "tsyringe";

import { User } from "../schemas/User";

interface ICreateUserDTO {
  email: string;
  socket_id: string;
  avatar: string;
  name: string;
}
@injectable()
class CreateUserService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async execute({ email, socket_id, avatar, name }: ICreateUserDTO) {
    const userAlreadyExists = await User.findOne({
      email,
    }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        {
          // eslint-disable-next-line no-underscore-dangle
          _id: userAlreadyExists._id,
        },
        {
          $set: { socket_id, avatar, name },
        },
        {
          new: true, // adicionando nova informçao
        }
      );
      return user;
    }
    const user = await User.create({
      email,
      socket_id,
      avatar,
      name,
    });

    return user;
  }
}

export { CreateUserService };
