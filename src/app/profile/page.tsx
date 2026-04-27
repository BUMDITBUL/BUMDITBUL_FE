import MainNav from "@/components/common/MainNav";
import ProfileSidebar from "@/features/profile/components/ProfileSidebar";
import ProfileStats from "@/features/profile/components/ProfileStats";
import SchedulePanel from "@/features/profile/components/SchedulePanel";

export default function ProfilePage() {
  return (
    <div className="h-screen flex flex-col bg-brand-black-900 overflow-hidden">
      <MainNav />
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1080px] flex items-start gap-12 px-6 py-10">
          <ProfileSidebar />
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <ProfileStats />
            <SchedulePanel />
          </div>
        </div>
      </div>
    </div>
  );
}
