import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = "1h";

export const authService = {
  async register(username: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: { username, email, password: hashedPassword },
      select: { id: true, username: true, email: true },
    });
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
    };
  },
};
