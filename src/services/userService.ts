import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

export const findUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (
  username: string,
  hashedPassword: string,
  email: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email,
    },
  });
};

// findUserById: prisma.user.findUnique({ where: { id } })
// updateUser: prisma.user.update({ where: { id }, data: { ... } })
// deleteUser: prisma.user.delete({ where: { id } })
// findAllUsers: prisma.user.findMany()
