import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  ["HOME", "home"],
  ["OUR STORY", "story"],
  ["SESSIONS", "sessions"],
  ["MENU", "menu"],
  ["GALLERY", "gallery"],
  ["LOCATION", "location"],
  ["CONTACT", "contact"],
];

const MOBILE_BREAKPOINT = 1000;

function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);
  const routeKey = `${location.pathname}${location.hash}`;
  const [menuState, setMenuState] = useState({ routeKey, open: false });
  const open = menuState.routeKey === routeKey && menuState.open;
  const [activeSection, setActiveSection] = useState("home");

  // Derive menu openness from the route. A changed URL closes it
  // without requiring a synchronous setState call inside an effect.
  const setOpen = useCallback((next) => {
    setMenuState((previous) => {
      const previousOpen = previous.routeKey === routeKey && previous.open;
      return {
        routeKey,
        open: typeof next === "function" ? next(previousOpen) : next,
      };
    });
  }, [routeKey]);

  // Close on Escape, outside clicks, and when switching to desktop layout.
  useEffect(() => {
    function handlePointerDown(event) {
      if (
        open &&
        !navRef.current?.contains(event.target) &&
        !menuButtonRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    function handleResize() {
      if (window.innerWidth > MOBILE_BREAKPOINT) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, setOpen]);

  // Scroll when navigating to a hash from another page.
  useEffect(() => {
    if (location.pathname !== "/") {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(location.hash.slice(1)) || "home";
    let frame = 0;
    frame = window.requestAnimationFrame(() => {
      if (id === "home") {
        if (!location.hash) {
          window.scrollTo({ top: 0, behavior: "auto" });
        } else {
          window.scrollTo({ top: 0, behavior: scrollBehavior() });
        }
      } else {
        document.getElementById(id)?.scrollIntoView({
          behavior: scrollBehavior(),
          block: "start",
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  // Follow scrolling, not just URL hashes, to keep the active link accurate.
  useEffect(() => {
    if (location.pathname !== "/") return;

    let frame = 0;
    function updateActiveSection() {
      frame = 0;
      const offset = 130;
      const sections = links
        .map(([, id]) => ({ id, element: document.getElementById(id) }))
        .filter(({ element }) => element);

      let current = "home";
      for (const { id, element } of sections) {
        if (element.getBoundingClientRect().top <= offset) current = id;
      }
      setActiveSection((previous) => (previous === current ? previous : current));
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    }

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  function goTo(event, id) {
    event.preventDefault();
    setOpen(false);

    if (id === "home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
      } else {
        navigate("/");
      }
      return;
    }

    const targetHash = `#${id}`;
    if (location.pathname === "/" && location.hash === targetHash) {
      document.getElementById(id)?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "start",
      });
    } else {
      navigate(`/${targetHash}`);
    }
  }

  return (
    <header className="lux-nav">
      <div className="lux-nav-inner">
        <Link
          to="/"
          className="lux-logo"
          aria-label="Lay Chalé Home"
          onClick={(event) => goTo(event, "home")}
        >
          <img src="/images/Logo laychale.png" alt="Lay Chalé" />
        </Link>

        <button
          ref={menuButtonRef}
          className="lux-menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="laychale-navigation"
          onClick={() => setOpen((previous) => !previous)}
        >
          <i className={`bi ${open ? "bi-x-lg" : "bi-list"}`} aria-hidden="true" />
        </button>

        <nav
          ref={navRef}
          id="laychale-navigation"
          className={`lux-nav-links ${open ? "show" : ""}`}
          aria-label="Main navigation"
        >
          {links.map(([label, id]) => {
            const isCurrent = location.pathname === "/" && activeSection === id;
            return (
              <a
                key={id}
                href={id === "home" ? "/" : `/#${id}`}
                onClick={(event) => goTo(event, id)}
                className={isCurrent ? "current" : ""}
                aria-current={isCurrent ? "location" : undefined}
              >
                {label}
              </a>
            );
          })}

          <Link
            to="/reservation"
            className="gold-shimmer-btn nav-book"
            onClick={() => setOpen(false)}
            aria-current={location.pathname === "/reservation" ? "page" : undefined}
          >
            <span>BOOK A TABLE</span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </nav>

        <div className="lux-social">
          <a
            href="https://line.me/R/ti/p/@laychale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Lay Chalé on LINE"
          >
            <i className="bi bi-chat-dots" aria-hidden="true" />
          </a>
          <a href="tel:0660916464" aria-label="Call Lay Chalé">
            <i className="bi bi-telephone" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
