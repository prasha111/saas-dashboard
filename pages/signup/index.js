import Head from "next/head";
import { useState } from "react";
import styles from "../../styles/Login.module.css";

export async function getServerSideProps() {
  return {
    props: {
      appName: "Cookie Consent Manager",
      subtitle: "Create your workspace and manage consent banners with ease.",
    },
  };
}

export default function SignupPage({ appName, subtitle }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{appName} | Sign Up</title>
        <meta
          name="description"
          content="Create an account for your cookie consent manager dashboard"
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
                Launch consent management for every domain you control.
              </h1>

              <p className={styles.heroText}>
                Create your account to manage cookie banners, regional rules,
                category preferences, and consent workflows from one place.
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

                <h2 className={styles.title}>Create account</h2>
                <p className={styles.subtitle}>{subtitle}</p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Prashant Sharma"
                    className={styles.input}
                    required
                  />
                </div>

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
                    required
                  />
                </div>

                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <span className={styles.secureTag}>Minimum 8 characters</span>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className={styles.input}
                    required
                  />
                </div>

                {error ? (
                  <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create dashboard account"}
                </button>
              </form>

              <div className={styles.divider}>
                <div className={styles.line}></div>
                <span className={styles.dividerText}>or</span>
                <div className={styles.line}></div>
              </div>

              <div className={styles.socialGrid}>
                <button className={styles.secondaryButton} type="button">
                  Continue with Google
                </button>
                <button className={styles.secondaryButton} type="button">
                  Continue with SSO
                </button>
              </div>

              <p className={styles.footerText}>
                Already have an account?{" "}
                <a href="/auth/login" className={styles.link}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}