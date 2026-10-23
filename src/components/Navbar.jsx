
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const links = [
  ["HOME", "home"],
  ["OUR STORY", "story"],
  ["SESSIONS", "sessions"],
  ["MENU", "menu"],
  ["GALLERY", "gallery"],
  ["LOCATION", "location"],
  ["CONTACT", "contact"],
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // ปิดเมนูมือถือเมื่อเปลี่ยน URL
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // เลื่อนหน้าไปยัง Section หลังเปลี่ยน URL
  useEffect(() => {
    if (location.pathname !== "/") {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
      return;
    }

    const id = location.hash.slice(1);

    if (!id || id === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    let frame;

    frame = requestAnimationFrame(() => {
      const section = document.getElementById(id);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  // ปิดเมนูเมื่อกด Escape
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function goTo(event, id) {
    event.preventDefault();
    setOpen(false);

    if (id === "home") {
      if (location.pathname === "/" && !location.hash) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        navigate("/");
      }

      return;
    }

    const targetHash = `#${id}`;

    if (
      location.pathname === "/" &&
      location.hash === targetHash
    ) {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    navigate(`/${targetHash}`);
  }

  return (
    <header className="lux-nav">
      <div className="lux-nav-inner">

        {/* LOGO */}
        <Link
          to="/"
          className="lux-logo"
          aria-label="Lay Chalé Home"
          onClick={(event) => {
            setOpen(false);

            if (location.pathname === "/" && !location.hash) {
              event.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
        >
          <img
            src="/images/Logo laychale.png"
            alt="Lay Chalé"
          />
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lux-menu-toggle"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="laychale-navigation"
          onClick={() => setOpen((previous) => !previous)}
        >
          <i
            className={`bi ${open ? "bi-x-lg" : "bi-list"}`}
            aria-hidden="true"
          />
        </button>

        {/* NAVIGATION */}
        <nav
          id="laychale-navigation"
          className={`lux-nav-links ${open ? "show" : ""}`}
          aria-label="Main navigation"
        >
          {links.map(([label, id]) => {
            const isCurrent =
              id === "home"
                ? location.pathname === "/" && !location.hash
                : location.pathname === "/" &&
                  location.hash === `#${id}`;

            return (
              <a
                key={id}
                href={id === "home" ? "/" : `/#${id}`}
                onClick={(event) => goTo(event, id)}
                className={isCurrent ? "current" : ""}
                aria-current={isCurrent ? "page" : undefined}
              >
                {label}
              </a>
            );
          })}

          {/* BOOKING BUTTON */}
          <Link
            to="/reservation"
            className="gold-shimmer-btn nav-book"
            onClick={() => setOpen(false)}
          >
            <span>BOOK A TABLE</span>
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </nav>

        {/* CONTACT ICONS */}
        <div className="lux-social">
          <a
            href="https://line.me/R/ti/p/@laychale"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact Lay Chalé on LINE"
          >
            <i className="bi bi-chat-dots" aria-hidden="true" />
          </a>

          <a
            href="tel:0660916464"
            aria-label="Call Lay Chalé"
          >
            <i className="bi bi-telephone" aria-hidden="true" />
          </a>
        </div>

      </div>
    </header>
  );
}
