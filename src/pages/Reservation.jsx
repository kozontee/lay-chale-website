
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const LINE_URL = "https://line.me/R/ti/p/@laychale";

const diningSessions = [
  {
    id: "lunch",
    title: "Lunch Session",
    time: "11:00 – 14:00",
    description: "A beautiful midday gathering.",
    image: "/images/session1.jpg",
  },
  {
    id: "golden",
    title: "Golden Hour",
    time: "16:30 – 19:30",
    description: "Warm light and wonderful company.",
    image: "/images/session2.jpg",
  },
  {
    id: "evening",
    title: "Evening Dining",
    time: "19:30 – 22:30",
    description: "Precious moments after sunset.",
    image: "/images/session3.jpg",
  },
];

const reservationPhotos = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Gathering at Lay Chalé",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Friends dining at Lay Chalé",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Celebration at Lay Chalé",
  },
  {
    src: "/images/session1.jpg",
    alt: "Lunch at Lay Chalé",
  },
  {
    src: "/images/session2.jpg",
    alt: "Dining atmosphere at Lay Chalé",
  },
  {
    src: "/images/session3.jpg",
    alt: "Evening dining at Lay Chalé",
  },
];

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================================
   CALENDAR
========================================= */

function BookingCalendar({ value, onChange }) {
  const today = new Date();

  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ];

  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  function moveMonth(amount) {
    setVisibleMonth(new Date(year, month + amount, 1));
  }

  return (
    <div className="lux-calendar">
      <div className="lux-calendar-head">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          disabled={visibleMonth <= currentMonth}
          aria-label="Previous month"
        >
          <i className="bi bi-chevron-left" />
        </button>

        <strong>
          {visibleMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </strong>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          aria-label="Next month"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="lux-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <span className="weekday" key={day}>
              {day}
            </span>
          )
        )}

        {days.map((day, index) => {
          if (!day) {
            return <span key={`empty-${index}`} />;
          }

          const date = new Date(year, month, day);
          const dateValue = toDateString(date);

          const todayStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );

          const disabled =
            date < todayStart || date.getDay() === 0;

          return (
            <button
              key={dateValue}
              type="button"
              disabled={disabled}
              className={value === dateValue ? "chosen" : ""}
              onClick={() => onChange(dateValue)}
              aria-pressed={value === dateValue}
              aria-label={date.toDateString()}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="calendar-help">
        Sundays are closed. Please select an available day.
      </p>
    </div>
  );
}

/* =========================================
   AUTOMATIC RESERVATION PHOTO STRIP
========================================= */

function ReservationPhotoStrip() {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function getStep() {
      const firstImage = track.querySelector("img");
      if (!firstImage) return 0;

      const gap =
        parseFloat(getComputedStyle(track).columnGap) || 0;

      return firstImage.getBoundingClientRect().width + gap;
    }

    function moveNext() {
      if (!trackRef.current || pausedRef.current) return;

      const maxScroll =
        track.scrollWidth - track.clientWidth;

      if (maxScroll <= 2) return;

      const step = getStep();
      if (!step) return;

      if (track.scrollLeft >= maxScroll - 5) {
        track.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        track.scrollBy({
          left: step,
          behavior: "smooth",
        });
      }
    }

    function startTimer() {
      window.clearInterval(timerRef.current);

      timerRef.current = window.setInterval(
        moveNext,
        3500
      );
    }

    function pauseTimer() {
      pausedRef.current = true;
    }

    function resumeTimer() {
      pausedRef.current = false;
    }

    startTimer();

    track.addEventListener("mouseenter", pauseTimer);
    track.addEventListener("mouseleave", resumeTimer);
    track.addEventListener("focusin", pauseTimer);
    track.addEventListener("focusout", resumeTimer);
    track.addEventListener("touchstart", pauseTimer, {
      passive: true,
    });
    track.addEventListener("touchend", resumeTimer, {
      passive: true,
    });

    return () => {
      window.clearInterval(timerRef.current);

      track.removeEventListener("mouseenter", pauseTimer);
      track.removeEventListener("mouseleave", resumeTimer);
      track.removeEventListener("focusin", pauseTimer);
      track.removeEventListener("focusout", resumeTimer);
      track.removeEventListener("touchstart", pauseTimer);
      track.removeEventListener("touchend", resumeTimer);
    };
  }, []);

  return (
    <div
      className="reservation-photo-strip"
      ref={trackRef}
      aria-label="Lay Chalé photo gallery"
      tabIndex={0}
    >
      {reservationPhotos.map((photo) => (
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          draggable="false"
        />
      ))}
    </div>
  );
}

/* =========================================
   RESERVATION PAGE
========================================= */

export default function Reservation() {
  const [date, setDate] = useState("");
  const [sessionId, setSessionId] = useState("golden");
  const [guests, setGuests] = useState("2");
  const [request, setRequest] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const selectedSession = diningSessions.find(
    (item) => item.id === sessionId
  );

  const guestNumber = Number(guests);
  const guestsValid =
    Number.isSafeInteger(guestNumber) && guestNumber >= 1;

  const dateValid = (() => {
    if (!date) return false;

    const [year, month, day] = date.split("-").map(Number);
    const selected = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      selected >= today &&
      selected.getDay() !== 0 &&
      toDateString(selected) === date
    );
  })();

  const message = [
    "LAY CHALÉ — RESERVATION REQUEST",
    "",
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    `Email: ${email.trim() || "Not provided"}`,
    `Date: ${date}`,
    `Dining session: ${selectedSession.title}`,
    `Session hours: ${selectedSession.time}`,
    `Guests: ${guests}`,
    `Special requests: ${request.trim() || "None"}`,
    "",
    "Please confirm the table and arrival time.",
  ].join("\n");

  function nextFromSelection(event) {
    event.preventDefault();

    if (!dateValid) {
      window.alert("Please select a valid reservation date.");
      return;
    }

    if (!guestsValid) {
      window.alert("Please enter a valid number of guests.");
      return;
    }

    setStage(2);
  }

  function nextFromDetails(event) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      window.alert("Please enter your name and phone number.");
      return;
    }

    setStage(3);
    setCopied(false);
    setCopyError(false);
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <div className="lux-site reservation-page">
      <Navbar />

      {/* RESERVATION HERO */}
      <section className="reservation-hero">
        <div className="reservation-hero-image" />

        <div className="reservation-hero-copy">
          <span className="lux-kicker">RESERVATION</span>

          <h1>
            A TABLE
            <br />
            FOR PRECIOUS
            <br />
            MOMENTS.
          </h1>

          <div className="small-gold-line" />

          <p>
            Good food. Great company.
            Precious moments.
          </p>

          <span className="hero-cuisines">
            THAI · CHINESE · ITALIAN CUISINE
          </span>
        </div>
      </section>

      {/* BOOKING PANEL */}
      <section className="reservation-main">
        <div className="reservation-panel">
          <div className="reservation-progress">
            {[
              "SELECT DATE",
              "CHOOSE SESSION",
              "YOUR DETAILS",
              "REVIEW & SEND",
            ].map((title, index) => {
              const number = index + 1;
              const active = stage === 1
                ? number <= 2
                : stage === 2
                ? number <= 3
                : true;

              return (
                <div
                  className={`progress-item ${
                    active ? "active" : ""
                  }`}
                  key={title}
                >
                  <span className="progress-circle">
                    {number}
                  </span>
                  <span>{title}</span>
                </div>
              );
            })}
          </div>

          {/* STEP 1 */}
          {stage === 1 && (
            <form onSubmit={nextFromSelection}>
              <div className="reservation-columns">
                <div className="reservation-column">
                  <h2>SELECT DATE</h2>

                  <BookingCalendar
                    value={date}
                    onChange={setDate}
                  />
                </div>

                <div className="reservation-column">
                  <h2>CHOOSE DINING SESSION</h2>

                  <div className="lux-session-list">
                    {diningSessions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`lux-session-choice ${
                          sessionId === item.id ? "selected" : ""
                        }`}
                        onClick={() => setSessionId(item.id)}
                        aria-pressed={sessionId === item.id}
                      >
                        <span className="session-radio">
                          <span />
                        </span>

                        <img src={item.image} alt="" />

                        <span className="session-choice-copy">
                          <small>{item.time}</small>
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="session-disclaimer">
                    Your preferred session is a request.
                    The restaurant must confirm availability.
                  </p>
                </div>

                <div className="reservation-column">
                  <h2>NUMBER OF GUESTS</h2>

                  <div className="lux-guest-row">
                    <i className="bi bi-people" />

                    <div className="lux-guest-counter">
                      <button
                        type="button"
                        aria-label="Decrease guests"
                        disabled={guestNumber <= 1}
                        onClick={() =>
                          setGuests(
                            String(Math.max(1, (guestNumber || 1) - 1))
                          )
                        }
                      >
                        <i className="bi bi-dash" />
                      </button>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={guests}
                        aria-label="Number of guests"
                        onChange={(event) =>
                          setGuests(event.target.value)
                        }
                        onBlur={() => {
                          if (!guestsValid) setGuests("1");
                        }}
                        required
                      />

                      <button
                        type="button"
                        aria-label="Increase guests"
                        onClick={() =>
                          setGuests(
                            String(Math.max(0, guestNumber || 0) + 1)
                          )
                        }
                      >
                        <i className="bi bi-plus" />
                      </button>
                    </div>
                  </div>

                  {guestNumber >= 10 && (
                    <p className="group-notice">
                      For larger groups, our team will confirm
                      suitable arrangements.
                    </p>
                  )}

                  <h2 className="request-label">
                    SPECIAL REQUEST (OPTIONAL)
                  </h2>

                  <textarea
                    className="lux-request-input"
                    rows="4"
                    value={request}
                    onChange={(event) =>
                      setRequest(event.target.value)
                    }
                    placeholder="Birthday, anniversary, allergies, seating preference..."
                  />

                  <button
                    className="gold-shimmer-btn reservation-next"
                    type="submit"
                  >
                    <span>NEXT</span>
                    <i className="bi bi-arrow-right" />
                  </button>

                  <p className="reservation-hint">
                    Your table is not confirmed until the
                    restaurant confirms your request.
                  </p>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {stage === 2 && (
            <div className="reservation-stage">
              <span className="lux-kicker">YOUR DETAILS</span>

              <h2>LET'S GET ACQUAINTED.</h2>

              <p>
                Tell us how to contact you about your
                reservation request.
              </p>

              <form
                className="details-form"
                onSubmit={nextFromDetails}
              >
                <div className="details-grid">
                  <label>
                    FULL NAME *
                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label>
                    PHONE NUMBER *
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="Your phone number"
                      autoComplete="tel"
                      required
                    />
                  </label>

                  <label className="details-wide">
                    EMAIL (OPTIONAL)
                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <div className="stage-buttons">
                  <button
                    type="button"
                    className="outline-lux-btn"
                    onClick={() => setStage(1)}
                  >
                    ← BACK
                  </button>

                  <button
                    type="submit"
                    className="gold-shimmer-btn"
                  >
                    <span>REVIEW REQUEST</span>
                    <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3 */}
          {stage === 3 && (
            <div className="reservation-stage">
              <span className="lux-kicker">REVIEW & SEND</span>

              <h2>ONE LAST LOOK.</h2>

              <p>
                Review your details before contacting
                Lay Chalé on LINE.
              </p>

              <div className="review-card">
                <div>
                  <span>NAME</span>
                  <strong>{name}</strong>
                </div>

                <div>
                  <span>PHONE</span>
                  <strong>{phone}</strong>
                </div>

                <div>
                  <span>EMAIL</span>
                  <strong>{email || "Not provided"}</strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>{date}</strong>
                </div>

                <div>
                  <span>DINING SESSION</span>
                  <strong>
                    {selectedSession.title} · {selectedSession.time}
                  </strong>
                </div>

                <div>
                  <span>GUESTS</span>
                  <strong>{guests}</strong>
                </div>

                <div>
                  <span>SPECIAL REQUEST</span>
                  <strong>{request || "None"}</strong>
                </div>
              </div>

              <div className="stage-buttons">
                <button
                  type="button"
                  className="outline-lux-btn"
                  onClick={() => setStage(2)}
                >
                  ← EDIT DETAILS
                </button>

                <button
                  type="button"
                  className="gold-shimmer-btn"
                  onClick={copyMessage}
                >
                  <span>
                    {copied
                      ? "DETAILS COPIED"
                      : "COPY RESERVATION DETAILS"}
                  </span>
                  <i className="bi bi-copy" />
                </button>
              </div>

              {copied && (
                <p className="copy-feedback">
                  <i className="bi bi-check-circle" />
                  {" "}Copied successfully. Open LINE, paste
                  the details, and press Send.
                </p>
              )}

              {copyError && (
                <p className="copy-feedback">
                  Automatic copying is unavailable.
                  Please select and copy the text below.
                </p>
              )}

              <details className="manual-message">
                <summary>View reservation message</summary>
                <pre>{message}</pre>
              </details>

              <a
                className="line-action"
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-chat-dots" />
                OPEN LAY CHALÉ LINE ↗
              </a>

              <p className="reservation-hint">
                This sends a request only. Your table is
                not reserved until our team confirms it.
              </p>
            </div>
          )}
        </div>

        {/* FEATURES */}
        <div className="reservation-features">
          <div>
            <i className="bi bi-fork-knife" />
            <span>
              <strong>THAI · CHINESE · ITALIAN</strong>
              <small>Thoughtfully crafted cuisine</small>
            </span>
          </div>

          <div>
            <i className="bi bi-flower1" />
            <span>
              <strong>BOTANICAL ATMOSPHERE</strong>
              <small>A beautiful place to gather</small>
            </span>
          </div>

          <div>
            <i className="bi bi-people" />
            <span>
              <strong>EVERY OCCASION</strong>
              <small>Family, friends and celebrations</small>
            </span>
          </div>

          <div>
            <i className="bi bi-clock" />
            <span>
              <strong>DINING SESSIONS</strong>
              <small>Monday to Saturday</small>
            </span>
          </div>
        </div>
      </section>

      {/* AUTO-SLIDING PHOTO GALLERY */}
      <ReservationPhotoStrip />

      {/* FOOTER */}
      <footer className="reservation-footer">
        <div>
          <Link to="/" className="reservation-footer-name">
            LAY CHALÉ
          </Link>

          <p>
            Good food. Great company.
            <br />
            Beautiful moments.
          </p>
        </div>

        <div>
          <i className="bi bi-clock" />
          <span>
            Mon–Sat 11:00–14:00
            <br />
            16:30–22:30 · Sunday closed
          </span>
        </div>

        <div>
          <a href="tel:0660916464">
            <i className="bi bi-telephone" />
            066-091-6464
          </a>

          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bi bi-chat-dots" />
            LINE @laychale
          </a>
        </div>

        <Link to="/" className="back-home">
          ← BACK TO HOME
        </Link>
      </footer>
    </div>
  );
}
