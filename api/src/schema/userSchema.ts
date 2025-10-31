import { z } from 'zod';

export const userRegisterSchema = z.strictObject({
  name: z.string('Імʼя потрібне').min(1, 'Імʼя не може бути пустим'),
  username: z.string('Введіть свій логін').min(1, 'Логін не може бути пустим'),
  password: z.string('Пароль потрібен').min(6, 'Пароль має бути мінімум 6 символів'),
});
export type TypeUserRegisterRequestBody = z.infer<typeof userRegisterSchema>;

export const userLoginSchema = z.strictObject({
  username: z.string('Логін потрібен'),
  password: z.string('Пароль потрібен'),
});
export type TypeUserLoginRequestBody = z.infer<typeof userLoginSchema>;
