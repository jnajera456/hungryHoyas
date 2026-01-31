import Image from "next/image";
import Link from "next/link";
import styles from "./mission.module.css";

export default function MissionPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backLink}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950">
              <Image
                src="/HungryHoyasAppLogo.png"
                alt="Hungry Hoyas"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-semibold">HungryHoyas</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.heading}>Our Mission</h1>
        <p className={styles.subheading}>
          Helping Hoyas eat well without the mental load.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Healthy eating, simplified</h2>
          <p className={styles.sectionText}>
            College is a whirlwind of classes, deadlines, and decisions. Georgetown students—Hoyas—deserve to eat healthily without adding one more thing to worry about. We built Hungry Hoyas so you can fuel your body right at Leo&apos;s and other campus dining halls, without the stress of figuring it out on your own.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Less decision fatigue, better choices</h2>
          <p className={styles.sectionText}>
            Every day you make hundreds of small decisions. What to eat for lunch shouldn&apos;t be another source of mental exhaustion. When you&apos;re staring at the dining hall menu, wondering what fits your goals and what doesn&apos;t, that&apos;s decision fatigue. It leads to impulsive choices, skipped meals, or grabbing whatever is easiest—often not what your body needs.
          </p>
          <p className={styles.sectionText}>
            Hungry Hoyas takes that burden off your plate. Set your nutrition goals once. We&apos;ll show you what&apos;s on the menu today and suggest meals that match your macros and calorie targets. No guessing, no mental math—just clear options that work for you.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Built for Hoyas, by Hoyas</h2>
          <p className={styles.sectionText}>
            We know campus dining. We pull live menus from Hoya Eats so you see exactly what&apos;s available. Whether you&apos;re aiming for more protein, watching calories, or balancing macros, we help you build the right plate—so you can focus on what actually matters: your classes, your friends, and your life at Georgetown.
          </p>
        </section>

        <section className={styles.ctaSection}>
          <Link href="/" className={styles.ctaLink}>
            Get Started
          </Link>
        </section>
      </main>
    </div>
  );
}
