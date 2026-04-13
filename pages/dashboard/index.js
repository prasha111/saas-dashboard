import Head from "next/head";
import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  const stats = [
    { label: "Active domains", value: "12", change: "+2 this month" },
    { label: "Consent rate", value: "78.4%", change: "+4.1%" },
    { label: "Scanned cookies", value: "248", change: "18 new found" },
    { label: "Policy issues", value: "03", change: "Needs review" },
  ];

  const domains = [
    { name: "example.com", region: "EU", status: "Healthy", banner: "Active" },
    { name: "shop.example.com", region: "US", status: "Warning", banner: "Draft" },
    { name: "blog.example.com", region: "Global", status: "Healthy", banner: "Active" },
    { name: "app.example.com", region: "UK", status: "Healthy", banner: "Active" },
  ];

  const activity = [
    { event: "Banner updated", detail: "Homepage consent banner design changed", time: "2 min ago" },
    { event: "Cookie scan complete", detail: "17 trackers reviewed on example.com", time: "24 min ago" },
    { event: "Consent log exported", detail: "CSV download by admin@company.com", time: "1 hr ago" },
    { event: "Policy issue flagged", detail: "Marketing cookie before consent on shop.example.com", time: "3 hr ago" },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | Cookie Consent Manager</title>
      </Head>

      <div className={styles.page}>
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.brand}>
              <div className={styles.logo}>CC</div>
              <div>
                <p className={styles.brandTitle}>Cookie Consent</p>
                <p className={styles.brandSub}>Admin Panel</p>
              </div>
            </div>

            <nav className={styles.nav}>
              <a className={`${styles.navItem} ${styles.active}`} href="#">
                Overview
              </a>
              <a className={styles.navItem} href="#">
                Domains
              </a>
              <a className={styles.navItem} href="#">
                Consent Logs
              </a>
              <a className={styles.navItem} href="#">
                Cookie Scanner
              </a>
              <a className={styles.navItem} href="#">
                Banner Settings
              </a>
              <a className={styles.navItem} href="#">
                Integrations
              </a>
              <a className={styles.navItem} href="#">
                Team
              </a>
            </nav>
          </div>

          <div className={styles.sidebarCard}>
            <p className={styles.sidebarCardTitle}>Compliance score</p>
            <h3 className={styles.sidebarCardValue}>92%</h3>
            <p className={styles.sidebarCardText}>
              2 domains need attention for regional consent rules.
            </p>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>Dashboard</p>
              <h1 className={styles.title}>Consent overview</h1>
              <p className={styles.subtitle}>
                Monitor banners, domains, consent activity, and compliance issues.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button className={styles.secondaryBtn}>Export logs</button>
              <button className={styles.primaryBtn}>Add domain</button>
            </div>
          </header>

          <section className={styles.statsGrid}>
            {stats.map((item) => (
              <div key={item.label} className={styles.statCard}>
                <p className={styles.statLabel}>{item.label}</p>
                <h3 className={styles.statValue}>{item.value}</h3>
                <p className={styles.statChange}>{item.change}</p>
              </div>
            ))}
          </section>

          <section className={styles.contentGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2 className={styles.panelTitle}>Domain status</h2>
                  <p className={styles.panelSub}>Banner and compliance health per property</p>
                </div>
                <button className={styles.textBtn}>View all</button>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Banner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => (
                      <tr key={domain.name}>
                        <td>{domain.name}</td>
                        <td>{domain.region}</td>
                        <td>
                          <span
                            className={
                              domain.status === "Healthy"
                                ? `${styles.badge} ${styles.success}`
                                : `${styles.badge} ${styles.warning}`
                            }
                          >
                            {domain.status}
                          </span>
                        </td>
                        <td>{domain.banner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className={styles.panelTitle}>Consent breakdown</h2>
                    <p className={styles.panelSub}>Today across tracked domains</p>
                  </div>
                </div>

                <div className={styles.progressGroup}>
                  <div>
                    <div className={styles.progressMeta}>
                      <span>Accepted</span>
                      <span>64%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={`${styles.progressFill} ${styles.green}`} style={{ width: "64%" }} />
                    </div>
                  </div>

                  <div>
                    <div className={styles.progressMeta}>
                      <span>Rejected</span>
                      <span>21%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={`${styles.progressFill} ${styles.red}`} style={{ width: "21%" }} />
                    </div>
                  </div>

                  <div>
                    <div className={styles.progressMeta}>
                      <span>Customized</span>
                      <span>15%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div className={`${styles.progressFill} ${styles.blue}`} style={{ width: "15%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2 className={styles.panelTitle}>Recent activity</h2>
                    <p className={styles.panelSub}>Latest admin and system actions</p>
                  </div>
                </div>

                <div className={styles.activityList}>
                  {activity.map((item) => (
                    <div key={item.event + item.time} className={styles.activityItem}>
                      <div className={styles.activityDot}></div>
                      <div>
                        <p className={styles.activityTitle}>{item.event}</p>
                        <p className={styles.activityDetail}>{item.detail}</p>
                      </div>
                      <span className={styles.activityTime}>{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}