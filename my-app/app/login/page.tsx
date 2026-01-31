"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const canContinue = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      isValidEmail(email)
    );
  }, [firstName, lastName, email]);

 function handleNext() {
  if (!canContinue) return;

  router.push("/login/step-2");
}
  

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <Image
                src="/HungryHoyasAppLogo.png"
                alt="HungryHoyas logo"
                fill
                priority
                className={styles.brandLogo}
              />
            </div>
            <span className={styles.brandName}>HungryHoyas</span>
          </div>

          {/* Profile icon ONLY (no initials) */}
          <button className={styles.profileBtn} aria-label="Profile">
            <svg
              viewBox="0 0 24 24"
              className={styles.profileIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className={styles.main}>
        <div className={styles.card}>
          {/* Step indicator */}
          <div className={styles.stepRow}>
            <div className={styles.stepPill}>Step 1 of 3</div>
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} />
          </div>

          <h1 className={styles.title}>Let’s set up your profile</h1>

          <div className={styles.form}>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  className={styles.input}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  className={styles.input}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
              <p className={styles.helperText}>
                We’ll use this to save your macro goals across sessions.
              </p>
            </div>

            <button
  type="button"
  className={styles.nextBtn}
  onClick={handleNext}
  disabled={!canContinue}
>
  Next
</button>
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <nav className={styles.bottomNav} aria-label="Bottom Navigation">
        <a className={`${styles.navItem} ${styles.navActive}`} href="/">
          <NavIconHome />
          <span>Home</span>
        </a>

        <a className={styles.navItem} href="/plate">
          <NavIconPlate />
          <span>Plate</span>
        </a>

        <a className={styles.navItem} href="/progress">
          <NavIconProgress />
          <span>Progress</span>
        </a>

        <a className={styles.navItem} href="/profile">
          <NavIconProfile />
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}

/* --- Icons --- */

function NavIconHome() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.navIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function NavIconPlate() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.navIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16" />
    </svg>
  );
}

function NavIconProgress() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.navIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19V5" />
      <path d="M8 19v-6" />
      <path d="M12 19v-10" />
      <path d="M16 19v-4" />
      <path d="M20 19v-12" />
    </svg>
  );
}

function NavIconProfile() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.navIcon}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
