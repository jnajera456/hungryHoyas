"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./step-3.module.css";

type MacroStrictness = "Chill" | "Balanced" | "Strict";
type Dietary = "Vegetarian" | "Halal" | "Allergens" | "None";

export default function Page() {
  const router = useRouter();

  const stepText = "Step 3 of 3";
  const progressPct = 100;

  const [dietary, setDietary] = useState<Set<Dietary>>(new Set(["None"]));
  const [macroStrictness, setMacroStrictness] = useState<MacroStrictness>("Balanced");
  const [macroGuidance, setMacroGuidance] = useState<MacroStrictness>("Balanced");

  const dietaryList = useMemo(() => Array.from(dietary), [dietary]);

  function toggleDietary(option: Dietary) {
    setDietary((prev) => {
      const next = new Set(prev);

      // "None" behaves as mutually exclusive with everything else
      if (option === "None") {
        next.clear();
        next.add("None");
        return next;
      }

      // Selecting any non-None removes None
      if (next.has("None")) next.delete("None");

      // Toggle selected option
      if (next.has(option)) next.delete(option);
      else next.add(option);

      // If user deselects everything, fall back to None
      if (next.size === 0) next.add("None");

      return next;
    });
  }

  const canContinue = useMemo(() => true, []);

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.brand}>
            <div className={styles.roundLogo} aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.roundLogoImg}
                src="/HungryHoyasAppLogo.png"
                alt="HungryHoyas logo"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className={styles.brandText}>HungryHoyas</span>
          </div>

          <div className={styles.topRight}>
            <button className={styles.iconBtn} aria-label="Account" type="button">
              <UserIcon />
            </button>
            {/* initials removed */}
          </div>
        </header>

        {/* Step indicator */}
        <div className={styles.stepWrap}>
          <div className={styles.stepText}>{stepText}</div>
          <div className={styles.stepTrack} aria-hidden>
            <div className={styles.stepFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <h1 className={styles.headline}>You’re all set!</h1>
          <p className={styles.subhead}>Tell us about your profile (last step):</p>

          {/* Dietary - multi-select */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Dietary</div>

            <div className={styles.multiRow} role="group" aria-label="Dietary restrictions">
              {(["None", "Vegetarian", "Halal", "Allergens"] as const).map((opt) => {
                const active = dietary.has(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.pillBtn} ${active ? styles.pillActive : ""}`}
                    onClick={() => toggleDietary(opt)}
                    aria-pressed={active}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* optional: tiny debug-ish visibility without looking like debug */}
            <div className={styles.helperText}>
              Selected: {dietaryList.join(", ")}
            </div>
          </section>

          {/* Macro strictness - single select */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>Macro strictness</div>

            <Segmented<MacroStrictness>
              label="Macro strictness"
              value={macroStrictness}
              onChange={setMacroStrictness}
              options={["Chill", "Balanced", "Strict"]}
            />
          </section>


          {/* CTA */}
          <button
            className={styles.primaryBtn}
            disabled={!canContinue}
            type="button"
            onClick={() => {
              // Change this route to whatever your "Today's Menu" page is
              router.push("/menu/today");
            }}
          >
            Go to Today&apos;s Menu
          </button>
        </div>

        {/* Bottom nav */}
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

/* ---------------- Reusable pieces ---------------- */

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
    <div className={styles.segmented} role="radiogroup" aria-label={label}>
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

function MacroSlider({
  value,
  onChange,
  options,
}: {
  value: MacroStrictness;
  onChange: (v: MacroStrictness) => void;
  options: readonly MacroStrictness[];
}) {
  const idx = options.indexOf(value);
  const pct = idx === 0 ? 0 : idx === 1 ? 50 : 100;

  return (
    <div className={styles.sliderWrap} role="radiogroup" aria-label="Macro guidance">
      <div className={styles.sliderTrack} aria-hidden>
        <div className={styles.sliderFill} style={{ width: `${pct}%` }} />
        <div className={styles.sliderThumb} style={{ left: `${pct}%` }} />
      </div>

      <div className={styles.sliderLabels}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.sliderLabelBtn} ${active ? styles.sliderLabelActive : ""}`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */

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
  )}
