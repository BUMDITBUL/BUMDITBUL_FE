import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.'),
    verificationCode: z.string().min(1, '인증번호를 입력해주세요.'),
    password: z
      .string()
      .min(8, '8자 이상 입력해주세요.')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export const findPasswordEmailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
});

export const findPasswordCodeSchema = z.object({
  code: z.string().min(1, '인증번호를 입력해주세요.'),
});

export const onboardingSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요.')
    .regex(/^[가-힣]{2,5}$/, '닉네임은 2~5자 한글만 가능합니다.'),
  school: z.string().optional(),
  schoolLevel: z.string(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type FindPasswordEmailValues = z.infer<typeof findPasswordEmailSchema>;
export type FindPasswordCodeValues = z.infer<typeof findPasswordCodeSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
