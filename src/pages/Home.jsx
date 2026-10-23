
import { useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const MENU_URL =
  "https://online.anyflip.com/torpk/wewx/mobile/index.html";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lay+Chale+Restaurant";

const FACEBOOK_URL =
  "https://www.facebook.com/laychaleth";

const LINE_URL =
  "https://line.me/R/ti/p/@laychale";

const sessions = [
  {
    title: "LUNCH SESSION",
    time: "11:00 – 14:00",
    text: "A beautiful midday gathering.",
    image: "/images/session1.jpg",
  },
  {
    title: "GOLDEN HOUR",
    time: "16:30 – 19:30",
    text: "Warm light, wonderful company.",
    image: "/images/session2.jpg",
  },
  {
    title: "EVENING DINING",
    time: "19:30 – 22:30",
    text: "Precious moments after sunset.",
    image: "/images/session3.jpg",
  },
];

const dishes = [
  ["THAI", "/images/thai.jpg"],
  ["CHINESE", "/images/chinese.jpg"],
  ["ITALIAN", "/images/italian.jpg"],
];

export default function Home() {
  const galleryRef = useRef(null);

  function scrollGallery(direction) {
    galleryRef.current?.scrollBy({
      left: direction * 350,
      behavior: "smooth",
    });
  }

  return (
    <div className="lux-site">
      <Navbar />

      {/* HERO */}
      <section id="home" className="editorial-hero">
        <div className="hero-photo" />

        <div className="hero-left">
          <div className="botanical-corner botanical-left" />

          <div className="hero-copy">
            <span className="lux-kicker">
              A DINING EXPERIENCE
            </span>

            <h1>LAY CHALÉ</h1>

            <p>
              Good food. Great company.
              <br />
              Beautiful moments.
            </p>

            <Link
              to="/reservation"
              className="gold-shimmer-btn hero-book"
            >
              <span>BOOK A TABLE</span>
              <i className="bi bi-arrow-right" />
            </Link>

            <div className="hero-cuisines">
              THAI · CHINESE · ITALIAN
              <br />
              CUISINE
            </div>
          </div>
        </div>

        <div className="hero-photo-credit">
          THE ART OF DINING TOGETHER
        </div>
      </section>

      {/* OUR STORY */}
      <section
        id="story"
        className="editorial-section story-layout"
      >
        <div className="editorial-number">
          <span>01</span>
        </div>

        <div className="story-body">
          {/* LEFT: STORY TEXT */}
          <div className="story-text">
            <span className="lux-kicker">
              OUR STORY
            </span>

            <h2>
              A PLACE
              <br />
              FOR FLAVORS
              <br />
              AND CONNECTIONS
            </h2>

            <p>
              Lay Chalé brings together the distinctive
              flavours of Thai, Chinese, and Italian cuisine
              in an elegant and welcoming atmosphere.
            </p>

            <p>
              Enjoy private dining rooms, karaoke, live music,
              and convenient parking. From intimate gatherings
              to birthdays, corporate events, and special
              celebrations, we create a beautiful setting
              for every occasion.
            </p>

            <p>
              Lay Chalé — Where Every Moment Becomes
              a Beautiful Memory.
            </p>

            <p>
              Open Monday – Saturday.
            </p>

            <Link
              to="/reservation"
              className="editorial-link"
            >
              OUR PHILOSOPHY <span>→</span>
            </Link>
          </div>

          {/* RIGHT: STORY IMAGE */}
          <div className="story-visual">
            <img
              src="/images/story.jpg"
              alt="The welcoming dining atmosphere at Lay Chalé"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* DINING SESSIONS */}
      <section
        id="sessions"
        className="editorial-section editorial-standard"
      >
        <div className="editorial-number">
          <span>02</span>
        </div>

        <div className="editorial-content">
          <span className="lux-kicker">
            DINING SESSIONS
          </span>

          <h2>THREE EXPERIENCES THROUGHOUT THE DAY</h2>

          <div className="editorial-session-grid">
            {sessions.map((session) => (
              <Link
                to="/reservation"
                className="editorial-session"
                key={session.title}
              >
                <div className="editorial-img-wrap">
                  <img
                    src={session.image}
                    alt={session.title}
                    loading="lazy"
                  />
                </div>

                <div className="editorial-session-info">
                  <h3>{session.title}</h3>
                  <span>{session.time}</span>
                  <p>{session.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="editorial-section editorial-standard"
      >
        <div className="editorial-number">
          <span>03</span>
        </div>

        <div className="editorial-content">
          <span className="lux-kicker">OUR MENU</span>

          <h2>THAI · CHINESE · ITALIAN</h2>

          <p className="section-subline">
            SEASONAL INGREDIENTS. THOUGHTFULLY CRAFTED.
          </p>

          <div className="editorial-food-grid">
            {dishes.map(([title, image]) => (
              <a
                href={MENU_URL}
                target="_blank"
                rel="noopener noreferrer"
                key={title}
                className="food-card"
              >
                <div className="editorial-img-wrap">
                  <img
                    src={image}
                    alt={`${title} cuisine`}
                    loading="lazy"
                  />
                </div>

                <span>{title} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="editorial-section editorial-standard"
      >
        <div className="editorial-number">
          <span>04</span>
        </div>

        <div className="editorial-content">
          <span className="lux-kicker">GALLERY</span>

          <div className="gallery-title-row">
            <div className="gallery-title-copy">
              <h2>MOMENTS AT LAY CHALÉ</h2>

              <p className="section-subline">
                GOOD FOOD. GREAT COMPANY. BEAUTIFUL MOMENTS.
              </p>
            </div>

            <Link
              to="/reservation"
              className="gallery-reserve-btn"
            >
              <span>RESERVE A TABLE</span>
              <span className="gallery-reserve-arrow">→</span>
            </Link>
          </div>

          {/* GALLERY SLIDER */}
          <div className="gallery-slider">
            <button
              type="button"
              className="gallery-arrow"
              aria-label="Previous gallery photos"
              onClick={() => scrollGallery(-1)}
            >
              <i className="bi bi-arrow-left" />
            </button>

            <div
              className="editorial-gallery"
              ref={galleryRef}
            >
              {[1, 2, 3, 4].map((number) => (
                <div
                  className="editorial-img-wrap"
                  key={number}
                >
                  <img
                    src={`/images/gallery-${number}.jpg`}
                    alt={`Lay Chalé gallery photo ${number}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="gallery-arrow"
              aria-label="Next gallery photos"
              onClick={() => scrollGallery(1)}
            >
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="home-location">
        <div>
          <span className="lux-kicker">VISIT US</span>

          <h2>COME MAKE MEMORIES.</h2>

          <p>
            A botanical dining atmosphere beside the railway.
          </p>
        </div>

        <div className="home-location-details">
          <div>
            <i className="bi bi-clock" />

            <span>
              MON – SAT
              <br />
              11:00–14:00 / 16:30–22:30
              <br />
              SUNDAY CLOSED
            </span>
          </div>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-geo-alt" />
            <span>GET DIRECTIONS ↗</span>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="editorial-footer">
        <div className="footer-name">
          <h3>LAY CHALÉ</h3>

          <p>
            Good food. Great company. Beautiful moments.
          </p>

          <p>
            © {new Date().getFullYear()} Lay Chalé.
            All rights reserved.
          </p>
        </div>

        <div className="footer-info">
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-geo-alt" />
            <span>FIND US ON GOOGLE MAPS</span>
          </a>

          <a href="tel:0660916464">
            <i className="bi bi-telephone" />
            <span>066-091-6464</span>
          </a>

          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-chat-dots" />
            <span>LINE @laychale</span>
          </a>

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-facebook" />
            <span>FACEBOOK · LAY CHALÉ ↗</span>
          </a>
        </div>

        <div className="footer-actions">
          <Link to="/reservation">
            BOOK A TABLE ↗
          </Link>

          <a
            href={MENU_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            VIEW MENU ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
