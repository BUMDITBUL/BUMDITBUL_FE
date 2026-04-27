import MainNav from "@/components/common/MainNav";
import ProfileEditForm from "@/features/profile/components/ProfileEditForm";
import BackButton from "@/components/ui/BackButton";

export default function ProfileEditPage() {
  return (
    <div className="h-screen flex flex-col bg-brand-black-900 overflow-hidden">
      <MainNav />
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1080px] flex flex-col min-h-0 px-6 py-6 gap-5">

          {/* 뒤로가기 */}
          <BackButton href="/profile" />

          {/* 타이틀 */}
          <div className="flex flex-col gap-1.5 shrink-0">
            <h1 className="text-white font-bold text-2xl">프로필을 수정해주세요.</h1>
            <p className="text-white/55 text-sm">닉네임과 학교명을 변경할 수 있어요.</p>
          </div>

          {/* 본문 */}
          <div className="flex gap-6 flex-1 min-h-0">
            <ProfileEditForm />
          </div>

        </div>
      </div>
    </div>
  );
}
