export interface IUser {
  id: number,
  email: string,
  name: string,
  lastname: string,
  surname?: string,
  phoneNumbers: string[],
  cardNumbers: string[],
  roles: string[],
  createdAt: Date,
  updatedAt: Date,
}