import { apiRequest } from "@/lib/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type EmailSendResponse = {
  message: string;
  isDuplicate: boolean;
};

export type EmailVerifyResponse = {
  verified: boolean;
};

export function login(payload: LoginRequest) {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function signup(payload: SignupRequest) {
  return apiRequest<TokenResponse>("/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export function sendEmail(email: string) {
  return apiRequest<EmailSendResponse>("/auth/email/send", {
    method: "POST",
    body: { email },
  });
}

export function verifyEmail(email: string, code: string) {
  return apiRequest<EmailVerifyResponse>("/auth/email/verify", {
    method: "POST",
    body: { email, code },
  });
}

export function googleLogin(idToken: string) {
  return apiRequest<TokenResponse>("/auth/oauth/google", {
    method: "POST",
    body: { idToken },
  });
}

export function logout(payload: { refreshToken: string }) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    body: payload,
  });
}

export function withdraw(accessToken: string | null) {
  return apiRequest<{ message: string }>("/auth/withdraw", {
    method: "DELETE",
    accessToken,
  });
}
