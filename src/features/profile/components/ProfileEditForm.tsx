"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";

const INPUT_STYLE = {
  height: "46px",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "12px",
  padding: "0 16px",
  background: "transparent",
  outline: "none",
};

const INPUT_FOCUS_STYLE = {
  ...INPUT_STYLE,
  border: "1px solid rgba(255,255,255,0.55)",
};

export default function ProfileEditForm() {
  const [nickname, setNickname] = useState("bbibbaroni");
  const [school, setSchool] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    if (value.trim().length === 0) {
      setNicknameError("닉네임을 입력해주세요.");
    } else if (value.length > 20) {
      setNicknameError("닉네임은 20자 이내로 입력해주세요.");
    } else {
      setNicknameError("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto">
      <div className="flex flex-col gap-6" style={{ maxWidth: "480px" }}>

        {/* 프로필 사진 */}
        <div className="flex flex-col gap-2">
          <span className="text-white/70 text-sm font-medium">프로필 사진</span>
          <div className="relative w-fit">
            <div
              className="rounded-full overflow-hidden"
              style={{ width: "100px", height: "100px" }}
            >
              <img
                src={previewUrl ?? "/images/icon/default_profile.svg"}
                alt="프로필"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            {/* 카메라 아이콘 */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{ width: "30px", height: "30px", background: "rgba(80,80,80,0.95)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.8"/>
              </svg>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-white/40 hover:text-white/70 transition-colors text-left"
            >
              기본 이미지로 되돌리기
            </button>
          )}
        </div>

        <Field label="닉네임" required>
          <input
            type="text"
            value={nickname}
            onChange={handleNicknameChange}
            onFocus={() => setFocusedField("nickname")}
            onBlur={() => setFocusedField(null)}
            placeholder="닉네임을 입력해주세요"
            maxLength={20}
            className="w-full text-sm text-white placeholder:text-white/30 focus:outline-none"
            style={focusedField === "nickname" ? INPUT_FOCUS_STYLE : INPUT_STYLE}
          />
          {nicknameError && (
            <p className="text-xs mt-1" style={{ color: "var(--color-brand-error, #ef5350)" }}>
              {nicknameError}
            </p>
          )}
        </Field>

        <Field label="학교명">
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            onFocus={() => setFocusedField("school")}
            onBlur={() => setFocusedField(null)}
            placeholder="학교명을 입력해주세요"
            maxLength={30}
            className="w-full text-sm text-white placeholder:text-white/30 focus:outline-none"
            style={focusedField === "school" ? INPUT_FOCUS_STYLE : INPUT_STYLE}
          />
        </Field>

        <Button>저장</Button>

      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white/70 text-sm font-medium">
        {label}
        {required && <span className="text-brand-green-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
