import MainNav from "@/components/common/MainNav";
import HeroBanner from "@/features/main/components/HeroBanner";
import MainSection from "@/features/main/components/MainSection";
import ExamDayModal from "@/components/ui/ExamDayModal";

export default function MainPage() {
  return (
    <div className="h-screen flex flex-col bg-brand-black-900 overflow-hidden">
      <ExamDayModal />
      <MainNav />
      <div className="flex-1 min-h-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1080px] flex flex-col min-h-0 pb-5 gap-5 px-6">
          <HeroBanner />
          <MainSection />
        </div>
      </div>
    </div>
  );
}
