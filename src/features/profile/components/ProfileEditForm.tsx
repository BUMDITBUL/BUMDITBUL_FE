"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import ConfirmModal from "@/components/ui/ConfirmModal";

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

interface ProfileEditFormProps {
  initialNickname?: string;
  initialSchool?: string;
  initialProfileImage?: string | null;
  onSave?: (data: { nickname: string; school: string; profileImage: string | null }) => void | Promise<void>;
}

export default function ProfileEditForm({
  initialNickname = "bbibbaroni",
  initialSchool = "",
  initialProfileImage = null,
  onSave,
}: ProfileEditFormProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [school, setSchool] = useState(initialSchool);
  const [nicknameError, setNicknameError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialProfileImage);
  const [profileImage, setProfileImage] = useState<string | null>(initialProfileImage);
  const [showConfirm, setShowConfirm] = useState(false);

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
    // Revoke previous blob URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setProfileImage(url);
  };

  useEffect(() => {
    // Cleanup blob URLs on unmount
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
              <Image
                src={previewUrl ?? "/images/icon/default_profile.svg"}
                alt="프로필"
                width={100}
                height={100}
                unoptimized={previewUrl?.startsWith("blob:") ?? false}
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
                if (previewUrl.startsWith("blob:")) {
                  URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(null);
                setProfileImage(null);
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

        <Button onClick={() => setShowConfirm(true)}>저장</Button>

        {showConfirm && (
          <ConfirmModal
            title="프로필을 저장하시겠습니까?"
            description="닉네임과 학교명이 변경됩니다."
            onConfirm={() => {
              onSave?.({ nickname, school, profileImage });
              setShowConfirm(false);
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}

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
