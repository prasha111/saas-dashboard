import Head from "next/head";
import styles from "../../styles/Login.module.css"

export async function getServerSideProps() {
  return {
    props: {
      appName: "Cookie Consent Manager",
      subtitle: "Manage consent banners, domains, and user preferences.",
    },
  };
}

export default function LoginPage({ appName, subtitle }) {
  return (
    <>
      <Head>
        <title>{appName} | Login</title>
        <meta
          name="description"
          content="Login to your cookie consent manager dashboard"
        />
      </Head>

      <div className={styles.page}>
        <div className={styles.wrapper}>
          <div className={styles.leftPanel}>
            <div>
              <div className={styles.badge}>
                <span className={styles.badgeDot}></span>
                Privacy-first platform
              </div>

              <h1 className={styles.heroTitle}>
                Simplify consent management across all your websites.
              </h1>

              <p className={styles.heroText}>
                Centralize cookie banner settings, consent logs, compliance
                status, and regional configuration from one dashboard.
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>120+</p>
                <p className={styles.statLabel}>Domains managed</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>99.9%</p>
                <p className={styles.statLabel}>Uptime</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>24/7</p>
                <p className={styles.statLabel}>Monitoring</p>
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.card}>
              <div className={styles.header}>
                <div className={styles.brandRow}>
                  <div className={styles.logo}>CC</div>
                  <div>
                    <p className={styles.brandName}>{appName}</p>
                    <p className={styles.brandSub}>Admin Dashboard</p>
                  </div>
                </div>

                <h2 className={styles.title}>Welcome back</h2>
                <p className={styles.subtitle}>{subtitle}</p>
              </div>

              <form className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@yourcompany.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <a href="#" className={styles.link}>
                      Forgot password?
                    </a>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className={styles.input}
                  />
                </div>

                <div className={styles.optionsRow}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    Remember me
                  </label>

                  <span className={styles.secureTag}>Secure login</span>
                </div>

                <button type="submit" className={styles.primaryButton}>
                  Sign in to dashboard
                </button>
              </form>

              <div className={styles.divider}>
                <div className={styles.line}></div>
                <span className={styles.dividerText}>or</span>
                <div className={styles.line}></div>
              </div>

              <div className={styles.socialGrid}>
                <button className={styles.secondaryButton}>
                  Continue with Google
                </button>
                <button className={styles.secondaryButton}>
                  Continue with SSO
                </button>
              </div>

              <p className={styles.footerText}>
                Need access?{" "}
                <a href="#" className={styles.link}>
                  Request an account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}