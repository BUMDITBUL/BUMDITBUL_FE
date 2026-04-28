"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MOCK_USER } from "@/constants/mockData";
import ConfirmModal from "@/components/ui/ConfirmModal";

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M9 1.5l2.5 2.5-7.5 7.5H1.5V9L9 1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditButton({ label, href }: { label: string; href?: string }) {
  const className = "w-full flex items-center justify-center gap-2 text-white/60 text-sm hover:bg-white/5 transition-colors";
  const style = { height: "46px", border: "1px solid rgba(255,255,255,0.55)", borderRadius: "14px" };
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {label}
        <PencilIcon />
      </Link>
    );
  }
  return (
    <button type="button" className={className} style={style}>
      {label}
      <PencilIcon />
    </button>
  );
}

interface ProfileSidebarProps {
  username?: string;
  handle?: string;
}

export default function ProfileSidebar({ username = MOCK_USER.nickname, handle = MOCK_USER.nickname }: ProfileSidebarProps) {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    // TODO: 로그아웃 API 연동
    setShowLogout(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 shrink-0" style={{ width: "280px" }}>
      {/* 프로필 이미지 */}
      <div
        className="rounded-full overflow-hidden"
        style={{ width: "160px", height: "160px", border: "2px solid rgba(255,255,255,0.15)" }}
      >
        <Image
          src="/images/icon/default_profile.svg"
          alt="프로필"
          width={160}
          height={160}
          className="w-full h-full object-cover"
              unoptimized
            />
      </div>

      {/* 이름 + 핸들 */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-white font-bold text-xl">{username}</span>
        <span className="text-sm text-brand-black-500">@{handle}</span>
      </div>

      {/* 편집 버튼 영역 */}
      <div className="w-full flex flex-col gap-3">
        <EditButton label="프로필 수정" href="/profile/edit" />
        <div className="h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        <EditButton label="시험범위 수정" href="/profile/exam-range" />
        <EditButton label="과목별 성적 수정" href="/profile/subject-grade" />
      </div>

      {/* 계정 영역 */}
      <div className="w-full pt-2">
        <button
          type="button"
          onClick={() => setShowLogout(true)}
          className="w-full text-center text-sm text-white/40 hover:text-white/70 transition-colors py-2"
        >
          로그아웃
        </button>
      </div>

      {showLogout && (
        <ConfirmModal
          title="로그아웃 하시겠습니까?"
          confirmLabel="로그아웃"
          cancelLabel="취소"
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}
