import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Circular Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
              <Image
                src="/HungryHoyasAppLogo.png"
                alt="Hungry Hoyas logo"
                fill
                priority
                className="object-contain p-1"
              />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              HungryHoyas
            </span>
          </div>

          {/* Profile Icon */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            aria-label="Profile"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
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

      {/* Main Content */}
      <main className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left Section */}
        <section>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Eat smarter in the dining hall
          </h1>

          <p className="mt-3 max-w-prose text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
            Build the best plate from today&apos;s dining hall menu.
          </p>

          <ul className="mt-6 space-y-3">
            <FeatureItem text="See what's open right now" />
            <FeatureItem text="Hit your macros without guessing" />
            <FeatureItem text="AI plate suggestions from today's menu" />
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/onboarding"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
            >
              Get Started
            </a>

            <a
              href="/menu"
              className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 sm:w-auto"
            >
              Continue <span className="ml-2 text-zinc-400">›</span>
            </a>

            <a
              href="/mission"
              className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base font-semibold text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:w-auto"
            >
              Our Mission
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-400">
            Not affiliated with Georgetown Dining
          </p>
        </section>

        {/* Right Section – Phone Card */}
        <section>
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="h-6" />

              <div className="px-6 pb-8 pt-6 text-center">
                <div className="relative mx-auto h-56 w-56 sm:h-64 sm:w-64">
                  <Image
                    src="/HungryHoyasAppLogo.png"
                    alt="Hungry Hoyas logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
                  Build the best plate from today&apos;s dining hall menu.
                </p>

                <div className="mt-6 space-y-3 text-left">
                  <PhoneBullet text="See what's open right now" />
                  <PhoneBullet text="Hit your macros without guessing" />
                  <PhoneBullet text="AI plate suggestions from today's menu" />
                </div>

                <div className="mt-8">
                  <a
                    href="/onboarding"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    Get Started
                  </a>

                  <div className="mt-3 text-sm text-zinc-500">
                    Already set up?{" "}
                    <a
                      href="/menu"
                      className="font-semibold text-zinc-800 hover:underline dark:text-zinc-100"
                    >
                      Continue
                    </a>{" "}
                    ›
                  </div>

                  <a
                    href="/mission"
                    className="mt-3 inline-block text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                  >
                    Our Mission
                  </a>

                  <p className="mt-4 text-xs text-zinc-400">
                    Not affiliated with Georgetown Dining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        ✓
      </span>
      <span>{text}</span>
    </li>
  );
}

function PhoneBullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3 shadow-sm">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        ✓
      </span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
