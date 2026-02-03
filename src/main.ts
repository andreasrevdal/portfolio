import "./styles.css";

const profile = {
  name: "Andreas Laurendz Revdal",
  roleShort: "Datacenter IT Consultant",
  org: "Sykehuspartner",
  location: "Norway",
  since: "March 2025",
  languages: "Norwegian / English",
  email: "andreas@revdal.no",
  github: "https://github.com/andreasrevdal",
  linkedin: "https://www.linkedin.com/in/andreasrevdal/",
};

const topSkills = [
  "Linux servers",
  "Windows servers",
  "Active Directory / LDAP",
  "Networking & switching (Layer 4)",
  "VMware / ESXi",
  "Proxmox",
  "TrueNAS / TrueNAS SCALE",
  "Kubernetes / K8s / K3s",
] as const;

type Certification = { title: string; hot?: boolean };

const certifications: readonly Certification[] = [
  { title: "Azure Active Directory: Basics", hot: true },
  { title: "Microsoft 365: Implement Modern Device Services" },
  { title: "Microsoft 365: Implement Security and Threat Management", hot: true },
  { title: "Microsoft Office 365: Administration" },
  { title: "Microsoft Office 365: Advanced Threat Protection", hot: true },
  { title: "Network Design and Performance Evaluation with Simulations" },
  { title: "Penetration Testing Active Directory" },
  { title: "NSM — Principles of ICT Security" },
] as const;

type WorkItem = {
  title: string;
  when: string;
  org: string;
  bullets: readonly string[];
};

const workHistory: readonly WorkItem[] = [
  {
    title: "IT Consultant",
    org: profile.org,
    when: "March 2025 – present",
    bullets: [
      "Datacenter operations and infrastructure work",
      "Stability, security, and documentation",
      "Collaboration across teams and vendors",
    ],
  },
  {
    title: "IT Consultant — On-call & Critical Systems",
    org: profile.org,
    when: "November 2024 – March 2025",
    bullets: [
      "24/7 responsibility for critical services",
      "Incident and outage coordination",
      "Fast troubleshooting under pressure",
    ],
  },
  {
    title: "IT Consultant",
    org: profile.org,
    when: "March 2022 – November 2024",
    bullets: [
      "Cross-platform troubleshooting",
      "Training and knowledge sharing",
      "Adaptation, advisory work, and strong documentation",
    ],
  },
] as const;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  children: Array<Node | string> = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  for (const child of children) node.append(child instanceof Node ? child : document.createTextNode(child));
  return node;
}

/** Dynamic favicon built from /me.png (circle crop + subtle ring) */
async function setDynamicFavicon(imageUrl: string) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load favicon image"));
  });

  const size = 96;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "rgba(7,9,12,1)";
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.clip();

  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(216,195,165,0.72)";
  ctx.lineWidth = 3;
  ctx.stroke();

  const link = document.getElementById("dynamic-favicon") as HTMLLinkElement | null;
  if (link) link.href = canvas.toDataURL("image/png");
}

function toast(msg: string) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  window.setTimeout(() => t.classList.remove("show"), 900);
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

function build() {
  const root = document.getElementById("app");
  if (!root) return;

  const bg = el("div", { class: "bg", "aria-hidden": "true" });
  const glow = el("div", { class: "glow", "aria-hidden": "true" });

  const header = el("div", { class: "card header delay1" }, [
    el("div", { class: "identity" }, [
      el("img", { class: "avatar", src: "/me.png", alt: "Avatar" }),
      el("div", { class: "title" }, [
        el("strong", {}, [profile.name]),
        el("span", {}, [`${profile.roleShort} — ${profile.org} · ${profile.location}`]),
      ]),
    ]),
    el("div", { class: "actions" }, [
      el("button", { class: "btn primary", id: "copyEmail", type: "button" }, ["Copy email"]),
      el("a", { class: "btn", href: profile.github, target: "_blank", rel: "noreferrer" }, ["GitHub"]),
      el("a", { class: "btn", href: profile.linkedin, target: "_blank", rel: "noreferrer" }, ["LinkedIn"]),
    ]),
  ]);

  const quick = el("div", { class: "card delay2" }, [
    el("h2", { class: "h" }, ["Quick info"]),
    el("p", { class: "p" }, ["Minimal. Fast. Everything you need in one glance."]),
    el("div", { class: "kv" }, [
      el("div", { class: "kvrow" }, [el("b", {}, ["Role"]), el("span", {}, [`${profile.roleShort} — ${profile.org}`])]),
      el("div", { class: "kvrow" }, [el("b", {}, ["Since"]), el("span", {}, [profile.since])]),
      el("div", { class: "kvrow" }, [el("b", {}, ["Languages"]), el("span", {}, [profile.languages])]),
      el("div", { class: "kvrow" }, [el("b", {}, ["Email"]), el("span", {}, [profile.email])]),
    ]),
  ]);

  const skills = el("div", { class: "card delay2" }, [
    el("h2", { class: "h" }, ["Top skills"]),
    el("p", { class: "p" }, ["Core infrastructure focus."]),
    el(
      "div",
      { class: "tags" },
      topSkills.map((s, i) => {
        const cls = i < 2 ? "tag hot" : i === 2 ? "tag sage" : "tag";
        return el("span", { class: cls }, [s]);
      })
    ),
  ]);

  const certs = el("div", { class: "card certs delay3" }, [
    el("h2", { class: "h" }, ["Certifications"]),
    el("p", { class: "p" }, ["Identity, Microsoft 365, security, and networking."]),
    el(
      "div",
      { class: "tags" },
      certifications.map((c) => el("span", { class: c.hot ? "tag hot" : "tag" }, [c.title]))
    ),
  ]);

  const work = el("div", { class: "card work delay3" }, [
    el("h2", { class: "h" }, ["Work"]),
    el("p", { class: "p" }, ["Previous roles and responsibilities."]),
    el(
      "div",
      { class: "timeline" },
      workHistory.map((w) =>
        el("div", { class: "job" }, [
          el("div", { class: "whenPill" }, [
            el("div", { class: "when" }, [w.when]),
            el("div", { class: "org" }, [w.org]),
          ]),
          el("div", {}, [
            el("h3", {}, [w.title]),
            el("ul", {}, w.bullets.map((b) => el("li", {}, [b]))),
          ]),
        ])
      )
    ),
  ]);

  const main = el("div", { class: "main" }, [quick, skills, certs, work]);

  const toastEl = el("div", {
    class: "toast",
    id: "toast",
    role: "status",
    "aria-live": "polite",
  });

  const footerFixed = el("div", { class: "footer-fixed" }, ["© 2026 Andreas Laurendz Revdal"]);

  root.append(bg, glow, el("div", { class: "wrap" }, [header, main]), footerFixed, toastEl);

  const btn = document.getElementById("copyEmail") as HTMLButtonElement | null;
  btn?.addEventListener("click", async () => {
    try {
      await copyToClipboard(profile.email);
      toast("Email copied");
    } catch {
      toast("Clipboard blocked by browser");
    }
  });
}

setDynamicFavicon("/me.png").catch(() => {});
build();
