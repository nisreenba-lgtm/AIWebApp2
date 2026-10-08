import { AppHeader }
  from "@/components/AppHeader";
import { FeatureCard }
  from "@/components/FeatureCard";
import { DetectionPanel }
  from "@/components/DetectionPanel";
import { ApiStatus }
  from "@/components/ApiStatus";
import Link from "next/link";
export default function Home() {
  return (
    <main className="ux-shell">
      <AppHeader />
      <div className="ux-grid">
        <FeatureCard
          title="Animal Detection"
          description="ระบบตรวจจับและจำแนกประเภทสัตว์ด้วย AI"
        /><FeatureCard
          title="AI Chat"
          description="สนทนากับ Generative AI"
        />
      </div>
      <section className="sp-home-card">
        <div>
          <p className="sp-home-eyebrow">NEW IN WEEK 6</p>
          <h2>Saved Prompts</h2>
          <p>Save and manage prompt ideas for your AI application.</p>
        </div>
        <Link href="/saved-prompts" className="sp-home-link">
          Open Saved Prompts →
        </Link>
      </section>
      <DetectionPanel />
      <ApiStatus />
    </main>
  );
}

