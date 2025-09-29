import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, PanelsTopLeft, ShoppingBag, ChevronDown } from "lucide-react";
import { listSections } from "./store/forumRemote";
import { getDefaultFeed, setDefaultFeed, type FeedType } from "./store/feedPrefs";
import { t } from "./utils/i18n";

export default function ForumSubnav() {
  const loc = useLocation();
  const [workshopId, setWorkshopId] = React.useState<string | null>(null);

  // Load Workshop section id once
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sections = await listSections();
        const ws = (sections || []).find(
          (s: any) => String(s.title || "").toLowerCase() === "workshop"
        );
        if (alive) setWorkshopId(ws?.id || null);
      } catch {
        if (alive) setWorkshopId(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Location-derived state
  const isMembers = loc.pathname.includes("/forum/members");
  const isWorkshop = workshopId
    ? loc.pathname.startsWith(`/forum/section/${workshopId}`)
    : false;
  const isForums = !isMembers && !isWorkshop; // default tab

  const urlFeed = (new URLSearchParams(loc.search || "")).get("feed") as
    | FeedType
    | null;
  const defaultFeed = getDefaultFeed();
  const currentFeed = (urlFeed || defaultFeed) as FeedType | null;

  // Small button helper
  const Btn = ({
    to,
    active,
    icon,
    children,
    disabled,
    title,
  }: {
    to: string;
    active?: boolean;
    icon: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    title?: string;
  }) =>
    disabled ? (
      <span
        className={`btn inline-flex items-center gap-2 ${
          active ? "btn-primary" : ""
        } opacity-60 cursor-not-allowed`}
        title={title || ""}
        aria-disabled
      >
        {icon} {children}
      </span>
    ) : (
      <Link
        to={to}
        className={`btn inline-flex items-center gap-2 ${
          active ? "btn-primary" : ""
        }`}
        title={title || ""}
      >
        {icon} {children}
      </Link>
    );

  // Dropdown for feed
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onDoc = () => setMenuOpen(false);
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // Supported feeds (cast to FeedType to satisfy TS if union differs)
  const feedOptions: Array<{ key: FeedType; label: string }> = [
    { key: ("latest" as unknown) as FeedType, label: t("Свежие", "Latest") },
    { key: ("hot" as unknown) as FeedType, label: t("Топ", "Hot") },
    { key: ("new" as unknown) as FeedType, label: t("Новые", "New") },
    {
      key: ("following" as unknown) as FeedType,
      label: t("Подписки", "Following"),
    },
  ];

  const labelForFeed = (key: string | null) =>
    feedOptions.find((f) => f.key === key)?.label ||
    t("Лента", "Feed");

  // Build URLs while preserving/setting ?feed=
  const withFeed = (basePath: string, feedKey: FeedType | null) => {
    const params = new URLSearchParams(loc.search);
    if (feedKey) params.set("feed", feedKey);
    else params.delete("feed");
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  };

  const forumsUrl = withFeed("/forum", currentFeed);
  const membersUrl = withFeed("/forum/members", null); // usually members list ignores feed
  const workshopUrl = workshopId
    ? withFeed(`/forum/section/${workshopId}`, null)
    : "#";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Tabs */}
      <Btn
        to={forumsUrl}
        active={isForums}
        icon={<PanelsTopLeft size={16} />}
      >
        {t("Форум", "Forums")}
      </Btn>

      <Btn
        to={workshopUrl}
        active={isWorkshop}
        disabled={!workshopId}
        icon={<ShoppingBag size={16} />}
        title={
          workshopId
            ? ""
            : t("Раздел Workshop ещё не создан", "Workshop section is not created yet")
        }
      >
        {t("Мастерская", "Workshop")}
      </Btn>

      <Btn to={membersUrl} active={isMembers} icon={<Users size={16} />}>
        {t("Участники", "Members")}
      </Btn>

      {/* Feed filter */}
      <div
        className="relative ml-auto"
        onClick={(e) => e.stopPropagation()}
        aria-label={t("Выбрать ленту", "Choose feed")}
      >
        <button
          type="button"
          className="btn inline-flex items-center gap-2"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="truncate max-w-[10rem]">
            {labelForFeed(currentFeed as string | null)}
          </span>
          <ChevronDown size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-xl border bg-background p-2 shadow-lg">
            {feedOptions.map((opt) => {
              const to = withFeed("/forum", opt.key);
              const active = currentFeed === opt.key;
              return (
                <Link
                  key={String(opt.key)}
                  to={to}
                  className={`block rounded-md px-3 py-2 text-sm hover:bg-muted ${
                    active ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    try {
                      setDefaultFeed(opt.key);
                    } catch {
                      // non-fatal
                    }
                    setMenuOpen(false);
                  }}
                >
                  {opt.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
