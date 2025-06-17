import { apiRequest } from "@/lib/api";

export const getAllUsers = async () => {
  return await apiRequest("/users", "GET");
};

export const getFarmers = async () => {
  const users = await getAllUsers();
  return users.filter((user: any) =>
    user.roles?.some((role: string) => role.includes("Farmer"))
  );
};

export const getConsumers = async () => {
  const users = await getAllUsers();
  return users.filter((user: any) =>
    user.roles?.some((role: string) => role.includes("Consumer"))
  );
};

export const getHandlers = async () => {
  const users = await getAllUsers();
  return users.filter((user: any) =>
    user.roles?.some((role: string) => role.includes("Handler"))
  );
};

export const getAllExceptCurrentUser = async (currentUsername: string) => {
  const users = await getAllUsers();
  return users.filter((user: any) => user.username !== currentUsername);
};
