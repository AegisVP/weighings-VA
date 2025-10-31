import bcrypt from 'bcrypt';

export const cryptPassword = (password: string): string => bcrypt.hashSync(password, 10);
