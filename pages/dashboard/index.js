import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [domains, setDomains] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [scanHistory, setScanHistory] = useState([]);
  const [liveCookies, setLiveCookies] = useState([]);
  const [consentLogs, setConsentLogs] = useState([]);

  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [editingCookie, setEditingCookie] = useState(null);

  const [formError, setFormError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isConsentExporting, setIsConsentExporting] = useState(false);
  const [isRecordingConsent, setIsRecordingConsent] = useState(false);

  const [form, setForm] = useState({
    domain: "",
    displayName: "",
    region: "Global",
    status: "Healthy",
    banner: "Draft",
  });

  const [stats] = useState([
    { label: "Active domains", value: "12", change: "+2 this month" },
    { label: "Consent rate", value: "78.4%", change: "+4.1%" },
    { label: "Scanned cookies", value: "248", change: "18 new found" },
    { label: "Policy issues", value: "03", change: "Needs review" },
  ]);

  const [activity] = useState([
    {
      event: "Banner updated",
      detail: "Homepage consent banner design changed",
      time: "2 min ago",
    },
    {
      event: "Cookie scan complete",
      detail: "17 trackers reviewed on example.com",
      time: "24 min ago",
    },
    {
      event: "Consent log exported",
      detail: "CSV download by admin@company.com",
      time: "1 hr ago",
    },
    {
      event: "Policy issue flagged",
      detail: "Marketing cookie before consent on shop.example.com",
      time: "3 hr ago",
    },
  ]);

  const getToken = () => localStorage.getItem("token");

  const fetchSites = async () => {
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/sites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch sites");
      }

      setDomains(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchCookies = async (siteId, siteObj = null) => {
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/cookies/${siteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch cookies");
      }

      setCookies(data);
      setSelectedSiteId(siteId);

      if (siteObj) {
        setSelectedSite(siteObj);
      } else {
        const foundSite = domains.find((d) => d._id === siteId);
        setSelectedSite(foundSite || null);
      }
    } catch (error) {
      console.error(error.message);
      setCookies([]);
    }
  };

  const fetchScanHistory = async (siteId) => {
    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/scan/history/${siteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch scan history");
      }

      setScanHistory(data.scans || []);
    } catch (error) {
      console.error(error.message);
      setScanHistory([]);
    }
  };

  const fetchConsentLogs = async (siteId) => {
    if (!siteId) return;

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/consent/${siteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch consent logs");
      }

      setConsentLogs(data.logs || []);
    } catch (error) {
      console.error(error.message);
      setConsentLogs([]);
    }
  };

  const fetchLiveCookies = () => {
    if (typeof document === "undefined") return;

    const rawCookies = document.cookie ? document.cookie.split("; ") : [];
    const parsed = rawCookies.map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return {
        name: name || "",
        value: rest.join("=") || "",
        domain: window.location.hostname,
      };
    });

    setLiveCookies(parsed);
  };

  const handleSaveCategory = async (newCategory) => {
    if (!editingCookie) return;

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/cookies/${editingCookie._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category: newCategory }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update cookie");
      }

      setCookies((prev) =>
        prev.map((cookie) =>
          cookie._id === editingCookie._id
            ? { ...cookie, category: newCategory }
            : cookie
        )
      );

      setEditingCookie(null);

      if (selectedSiteId) {
        fetchCookies(selectedSiteId, selectedSite);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.domain.trim() || !form.displayName.trim()) {
      setFormError("Domain and display name are required");
      return;
    }

    try {
      const token = getToken();

      const res = await fetch(`${API_URL}/api/sites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create site");
      }

      setForm({
        domain: "",
        displayName: "",
        region: "Global",
        status: "Healthy",
        banner: "Draft",
      });

      setIsModalOpen(false);
      fetchSites();
    } catch (error) {
      setFormError(error.message);
    }
  };

  const handleScanSite = async (siteId, siteObj = null) => {
    try {
      setIsScanning(true);
      const token = getToken();

      const res = await fetch(`${API_URL}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ siteId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Scan failed");
      }

      const currentSite =
        siteObj || domains.find((domain) => domain._id === siteId) || null;

      setSelectedSiteId(siteId);
      setSelectedSite(currentSite);

      await fetchCookies(siteId, currentSite);
      await fetchScanHistory(siteId);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportCookies = async () => {
    if (!selectedSiteId) return;

    try {
      setIsExporting(true);
      const token = getToken();

      const res = await fetch(`${API_URL}/api/cookies/${selectedSiteId}/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to export cookies");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cookies_${selectedSiteId}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportConsentLogs = async () => {
    if (!selectedSiteId) return;

    try {
      setIsConsentExporting(true);
      const token = getToken();

      const res = await fetch(`${API_URL}/api/consent/${selectedSiteId}/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to export consent logs");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `consent_${selectedSiteId}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsConsentExporting(false);
    }
  };

  const recordConsent = async ({ action, choices }) => {
    if (!selectedSiteId) return;

    try {
      setIsRecordingConsent(true);
      const token = getToken();
      const visitorId = `guest_${Date.now()}`;

      const res = await fetch(`${API_URL}/api/consent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: selectedSiteId,
          bannerId: "665f1a0012ab34ef56789000",
          visitorId,
          choices,
          action,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to record consent");
      }

      document.cookie = `cc_consent=${action}; path=/; max-age=31536000`;
      fetchLiveCookies();
      fetchConsentLogs(selectedSiteId);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsRecordingConsent(false);
    }
  };

  const handleAccept = async () => {
    await recordConsent({
      action: "accept_all",
      choices: {
        necessary: true,
        preferences: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
    });
  };

  const handleReject = async () => {
    await recordConsent({
      action: "reject_all",
      choices: {
        necessary: true,
        preferences: false,
        functional: false,
        analytics: false,
        marketing: false,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchSites().finally(() => setChecking(false));
  }, [router]);

  useEffect(() => {
    if (selectedSiteId) {
      fetchScanHistory(selectedSiteId);
      fetchConsentLogs(selectedSiteId);
      fetchLiveCookies();
    }
  }, [selectedSiteId]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p>Checking access...</p>
      </div>
    );
  }

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
              <p className={styles.welcomeText}>
                Welcome back{user?.name ? `, ${user.name}` : ""}.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button className={styles.secondaryBtn}>Export logs</button>
              <button
                className={styles.primaryBtn}
                onClick={() => setIsModalOpen(true)}
              >
                Add domain
              </button>
              <button className={styles.secondaryBtn} onClick={handleLogout}>
                Logout
              </button>
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

          <section className={styles.topGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2 className={styles.panelTitle}>Managed domains</h2>
                  <p className={styles.panelSub}>
                    {domains.length} properties connected to your workspace
                  </p>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Banner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.length > 0 ? (
                      domains.map((domain, index) => (
                        <tr key={domain._id || domain.domain || index}>
                          <td>
                            <div className={styles.domainCell}>
                              <span className={styles.domainName}>
                                {domain.domain}
                              </span>
                              <span className={styles.domainMeta}>
                                {domain.displayName}
                              </span>
                            </div>
                          </td>
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
                          <td>
                            <div className={styles.actionGroup}>
                              <button
                                className={styles.secondaryBtn}
                                onClick={() => handleScanSite(domain._id, domain)}
                                disabled={isScanning}
                              >
                                {isScanning && selectedSiteId === domain._id
                                  ? "Scanning..."
                                  : "Scan"}
                              </button>
                              <button
                                className={styles.secondaryBtn}
                                onClick={() => {
                                  setSelectedSite(domain);
                                  fetchCookies(domain._id, domain);
                                  fetchScanHistory(domain._id);
                                  fetchConsentLogs(domain._id);
                                }}
                              >
                                Cookies
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={styles.emptyCell}>
                          No domains added yet.
                        </td>
                      </tr>
                    )}
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
                      <span className={styles.progressValue}>64%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${styles.green}`}
                        style={{ width: "64%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className={styles.progressMeta}>
                      <span>Rejected</span>
                      <span className={styles.progressValue}>21%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${styles.red}`}
                        style={{ width: "21%" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className={styles.progressMeta}>
                      <span>Customized</span>
                      <span className={styles.progressValue}>15%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${styles.blue}`}
                        style={{ width: "15%" }}
                      />
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
                    <div
                      key={item.event + item.time}
                      className={styles.activityItem}
                    >
                      <div className={styles.activityDot}></div>
                      <div className={styles.activityContent}>
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

          {selectedSiteId && (
            <>
              <section className={styles.cookieSection}>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Cookie audit</h2>
                      <p className={styles.panelSub}>
                        {cookies.length} cookies found for{" "}
                        {selectedSite?.domain || "the selected domain"}
                      </p>
                    </div>

                    <button
                      className={styles.primaryBtn}
                      onClick={handleExportCookies}
                      disabled={isExporting}
                    >
                      {isExporting ? "Exporting..." : "Export CSV"}
                    </button>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Domain</th>
                          <th>Category</th>
                          <th>Path</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cookies.length > 0 ? (
                          cookies.map((cookie) => (
                            <tr key={cookie._id}>
                              <td>{cookie.name}</td>
                              <td>{cookie.domain}</td>
                              <td>
                                {editingCookie?._id === cookie._id ? (
                                  <select
                                    value={editingCookie.category}
                                    onChange={(e) =>
                                      setEditingCookie({
                                        ...editingCookie,
                                        category: e.target.value,
                                      })
                                    }
                                    className={styles.input}
                                  >
                                    <option value="necessary">Necessary</option>
                                    <option value="preferences">Preferences</option>
                                    <option value="functional">Functional</option>
                                    <option value="analytics">Analytics</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="unknown">Unknown</option>
                                  </select>
                                ) : (
                                  <span>{cookie.category}</span>
                                )}
                              </td>
                              <td>{cookie.path}</td>
                              <td>
                                {editingCookie?._id === cookie._id ? (
                                  <div className={styles.actionGroup}>
                                    <button
                                      className={styles.primaryBtn}
                                      onClick={() =>
                                        handleSaveCategory(editingCookie.category)
                                      }
                                    >
                                      Save
                                    </button>
                                    <button
                                      className={styles.secondaryBtn}
                                      onClick={() => setEditingCookie(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className={styles.textBtn}
                                    onClick={() => setEditingCookie(cookie)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className={styles.emptyCell}>
                              No cookies found for this site.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className={styles.cookieSection}>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Scan history</h2>
                      <p className={styles.panelSub}>
                        Last scans for {selectedSite?.domain || "selected domain"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Cookies</th>
                          <th>Page</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scanHistory.length > 0 ? (
                          scanHistory.map((scan) => (
                            <tr key={scan._id}>
                              <td>{new Date(scan.createdAt).toLocaleString()}</td>
                              <td>{scan.status}</td>
                              <td>{scan.cookieCount || 0}</td>
                              <td>{scan.pageUrl || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className={styles.emptyCell}>
                              No scan history found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className={styles.bannerSection}>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Banner preview</h2>
                      <p className={styles.panelSub}>
                        Live preview for {selectedSite?.domain || "selected domain"}
                      </p>
                    </div>
                  </div>

                  <div className={styles.bannerFrame}>
                    <div className={styles.banner}>
                      <div className={styles.bannerRow}>
                        <div>
                          <p className={styles.bannerTitle}>Your privacy</p>
                          <p className={styles.bannerText}>
                            We use cookies to enhance your browsing experience and
                            serve interest-based ads.
                          </p>
                        </div>

                        <div className={styles.bannerActions}>
                          <button
                            className={styles.secondaryBtn}
                            onClick={handleReject}
                            disabled={isRecordingConsent}
                          >
                            Reject all
                          </button>
                          <button
                            className={styles.primaryBtn}
                            onClick={handleAccept}
                            disabled={isRecordingConsent}
                          >
                            {isRecordingConsent ? "Saving..." : "Accept all"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.panelMarginTop}>
                    <h3 className={styles.panelTitle}>Cookies in browser</h3>
                    <p className={styles.panelSub}>
                      Current cookies for {selectedSite?.domain || "selected domain"}
                    </p>

                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Value</th>
                            <th>Domain</th>
                          </tr>
                        </thead>
                        <tbody>
                          {liveCookies.length > 0 ? (
                            liveCookies.map((cookie, index) => (
                              <tr key={`${cookie.name}-${index}`}>
                                <td>{cookie.name}</td>
                                <td>{cookie.value}</td>
                                <td>{cookie.domain}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className={styles.emptyCell}>
                                No cookies detected in browser.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              <section className={styles.cookieSection}>
                <div className={styles.panel}>
                  <div className={styles.panelHead}>
                    <div>
                      <h2 className={styles.panelTitle}>Consent logs</h2>
                      <p className={styles.panelSub}>
                        {consentLogs.length} consent events for{" "}
                        {selectedSite?.domain || "selected domain"}
                      </p>
                    </div>

                    <button
                      className={styles.primaryBtn}
                      onClick={handleExportConsentLogs}
                      disabled={isConsentExporting}
                    >
                      {isConsentExporting ? "Exporting..." : "Export CSV"}
                    </button>
                  </div>

                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Action</th>
                          <th>Banner</th>
                          <th>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {consentLogs.length > 0 ? (
                          consentLogs.map((log) => (
                            <tr key={log._id}>
                              <td>{new Date(log.createdAt).toLocaleString()}</td>
                              <td>{log.consent?.action || "-"}</td>
                              <td>{log.banner?.version || "-"}</td>
                              <td>{log.ip || "-"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className={styles.emptyCell}>
                              No consent logs found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>

        {isModalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setIsModalOpen(false)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalTitle}>Add domain</h2>
                  <p className={styles.modalSub}>
                    Create a new website entry for consent management.
                  </p>
                </div>
                <button
                  className={styles.modalClose}
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <form className={styles.modalForm} onSubmit={handleAddDomain}>
                <div className={styles.field}>
                  <label className={styles.label}>Domain</label>
                  <input
                    type="text"
                    name="domain"
                    placeholder="example.com"
                    value={form.domain}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Display name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="Main Website"
                    value={form.displayName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Region</label>
                  <select
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="Global">Global</option>
                    <option value="EU">EU</option>
                    <option value="US">US</option>
                    <option value="UK">UK</option>
                    <option value="IN">IN</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Warning">Warning</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Banner state</label>
                  <select
                    name="banner"
                    value={form.banner}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>

                {formError ? (
                  <p style={{ color: "#dc2626", fontSize: "14px" }}>
                    {formError}
                  </p>
                ) : null}

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.primaryBtn}>
                    Save domain
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}