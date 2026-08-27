import { AppHeader } from "@/components/AppHeader";
import { FeatureCard } from "@/components/FeatureCard";
export default function Home() {
  return (
    <main>
      <AppHeader />
      <br></br>
      <FeatureCard
        title="Object Detection"
        description="ตรวจจับวัตถุจากรูปภาพด้วย AI"
      />
      <br></br>
      <FeatureCard title="AI Chat" description="สนทนากับ Generative AI" />
      <br></br>
      <button>Start Detection</button>
    </main>
  );
}
