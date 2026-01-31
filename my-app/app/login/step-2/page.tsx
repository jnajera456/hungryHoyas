"use client";

import React, { useMemo, useState } from "react";
import styles from "./step-2.module.css"; // keep this path if css is in app/login/login.module.css

type Goal = "Cut" | "Maintain" | "Bulk";
type Activity = "Light" | "Moderate" | "High";
type Strictness = "Chill" | "Balanced" | "Strict";

export default function Page() {
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");

  const [goal, setGoal] = useState<Goal>("Maintain");
  const [activity, setActivity] = useState<Activity>("Moderate");
  const [strictness, setStrictness] = useState<Strictness>("Balanced");

  const canContinue = useMemo(() => true, []);

  // Step 2 of 3
  const stepText = "Step 2 of 3";
  const progressPct = 66.6667;

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.topBar}>
          <div className={styles.brand}>
            {/* Round logo: drop your actual image in /public/logo-round.png */}
            <div className={styles.roundLogo} aria-hidden>
              {/* If you add an image, it will render; otherwise fallback stays visible */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.roundLogoImg}
                src="/HungryHoyasAppLogo.png"
                alt="HungryHoyas logo"
                onError={(e) => {
                  // hide broken image icon if file doesn't exist
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <span className={styles.brandText}>HungryHoyas</span>
          </div>

          <div className={styles.topRight}>
            <button className={styles.iconBtn} aria-label="Account">
              <UserIcon />
            </button>
            {/* initials removed */}
          </div>
        </header>

        <div className={styles.stepWrap}>
          <div className={styles.stepText}>{stepText}</div>
          <div className={styles.stepTrack} aria-hidden>
            <div className={styles.stepFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <h1 className={styles.title}>Let’s set up your profile</h1>

        <div className={styles.form}>
          <div className={styles.twoCol}>
            <div className={styles.field}>
              <label className={styles.label}>Height</label>
              <div className={styles.inlineInputs}>
                <input
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="ft"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />

                <div className={styles.selectLike}>
                  <input
                    className={styles.selectInput}
                    inputMode="numeric"
                    placeholder="in"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                  />
                  <ChevronDown className={styles.chev} />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Weight</label>
              <div className={styles.inlineInputs}>
                <input
                  className={styles.input}
                  inputMode="numeric"
                  placeholder="lbs"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value)}
                />
                <div className={styles.unitPill} aria-hidden>
                  lbs
                </div>
              </div>
            </div>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>Goal</div>
           <Segmented<Goal>
  label="Goal"
  value={goal}
  onChange={setGoal}
  options={["Cut", "Maintain", "Bulk"]}
/>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>Activity</div>
            <Segmented<Activity>
  label="Activity"
  value={activity}
  onChange={setActivity}
  options={["Light", "Moderate", "High"]}
/>
          </div>

          <div className={styles.block}>
            <div className={styles.label}>How strict should I be about macros?</div>
            <Segmented<Strictness>
  label="Macro strictness"
  value={strictness}
  onChange={setStrictness}
  options={["Chill", "Balanced", "Strict"]}
/>
          </div>

          <button className={styles.primaryBtn} disabled={!canContinue} type="button">
            Next
          </button>
        </div>

        <nav className={styles.bottomNav} aria-label="Bottom navigation">
          <NavItem label="Home" active icon={<HomeIcon />} />
          <NavItem label="Plate" icon={<ForkIcon />} />
          <NavItem label="Plate" icon={<GlobeIcon />} />
          <NavItem label="Progress" icon={<GaugeIcon />} />
          <NavItem label="Profile" icon={<ProfileIcon />} />
        </nav>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */

function NavItem({
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button className={`${styles.navItem} ${active ? styles.navActive : ""}`} type="button">
      <div className={styles.navIcon}>{icon}</div>
      <div className={styles.navLabel}>{label}</div>
    </button>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  label: string;
}) {
  return (
    <div
      className={styles.segmented}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((opt) => {
        const isActive = opt === value;

        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.segBtn} ${isActive ? styles.segActive : ""}`}
            onClick={() => onChange(opt)}
          >
            <span className={styles.segText}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}


/* ---------------- Icons ---------------- */

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 9.5 12 15l5.5-5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 2v8a2 2 0 0 1-2 2H4V2h2v6h1V2Zm6 0h2v6a3 3 0 0 1-3 3h-1v11h-2V11h-1V9h3a1 1 0 0 0 1-1V2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm7.9 9h-3.2a15 15 0 0 0-1.1-5 8.04 8.04 0 0 1 4.3 5ZM12 4c1 1.4 1.8 3.6 2.2 7H9.8C10.2 7.6 11 5.4 12 4Zm-3.6 2a15 15 0 0 0-1.1 5H4.1a8.04 8.04 0 0 1 4.3-5ZM4.1 13h3.2a15 15 0 0 0 1.1 5 8.04 8.04 0 0 1-4.3-5Zm7.9 7c-1-1.4-1.8-3.6-2.2-7h4.4c-.4 3.4-1.2 5.6-2.2 7Zm3.6-2a15 15 0 0 0 1.1-5h3.2a8.04 8.04 0 0 1-4.3 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4a10 10 0 1 0 10 10A10 10 0 0 0 12 4Zm0 18a8 8 0 1 1 8-8 7.98 7.98 0 0 1-8 8Zm0-13a1 1 0 0 0-1 1v4.2l-2.1 2.1a1 1 0 1 0 1.4 1.4l2.4-2.4A1 1 0 0 0 13 15V10a1 1 0 0 0-1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}
