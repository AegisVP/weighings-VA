import { z } from 'zod';
import { featureSchema } from '../../../api/src/schema/featureSchema';
import type { TypeUserReduxState } from '../redux/user/userSlice';

export const userLocale = z.enum(['en', 'ua']);

export const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  locale: userLocale,
  features: z.array(featureSchema),
});

// #########  USER LOGIN SCHEMAS  #########
export const userLoginRequestSchema = z.object({
  username: z.string().min(1, 'Логін не може бути пустим'),
  password: z.string().min(1, 'Пароль не може бути пустим').min(6, 'Пароль має бути мінімум 6 символів'),
});
export const userLoginResponseSchema = z.strictObject({
  token: z.jwt(),
  // refreshToken: z.jwt(),
});
export type TypeUserLoginRequestBody = z.infer<typeof userLoginRequestSchema>;
export type TypeUserLoginResponsePayload = z.infer<typeof userLoginResponseSchema>;
// export type TypeUserLoginAction = Pick<TypeUserReduxState, 'refreshToken' | 'token'>;
export type TypeUserLoginAction = Pick<TypeUserReduxState, 'token'>;

// #########  USER REGISTER SCHEMAS  #########
export const userRegisterRequestSchema = userLoginRequestSchema.extend({
  name: z.string().min(1, 'Імʼя не може бути пустим'),
});
export const userRegisterResponseSchema = z.strictObject({
  token: z.jwt(),
  // refreshToken: z.jwt(),
});
export type TypeUserRegisterRequestBody = z.infer<typeof userRegisterRequestSchema>;
export type TypeUserRegisterResponsePayload = z.infer<typeof userRegisterResponseSchema>;
// export type TypeUserRegisterAction = Pick<TypeUserReduxState, 'refreshToken' | 'token'>;
export type TypeUserRegisterAction = Pick<TypeUserReduxState, 'token'>;

// #########  USER REFRESH SCHEMAS  #########
export const userRefreshResponseSchema = z.strictObject({
  user: userSchema,
});
export type TypeUserRefreshResponsePayload = z.infer<typeof userRefreshResponseSchema>;
export type TypeUserRefreshAction = Pick<TypeUserReduxState, 'user' | 'token'>;
