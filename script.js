/* ============================================================
   TẾT 2027 COUNTDOWN
   - Đếm ngược đến Mùng 1 Tết Đinh Mùi: 06/02/2027 00:00 (giờ VN, UTC+7)
   - Chuyển đổi Dương lịch -> Âm lịch (thuật toán thiên văn cổ điển,
     dùng cho lịch Việt Nam, múi giờ UTC+7)
   ============================================================ */

(function () {
  "use strict";

  // ---------- 1. ĐẾM NGƯỢC ----------
  // Mùng 1 Tết Đinh Mùi 2027 = 06/02/2027, 00:00:00 giờ Việt Nam (UTC+7)
  const TET_TARGET = new Date("2027-02-06T00:00:00+07:00").getTime();

  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMinutes = document.getElementById("minutes");
  const elSeconds = document.getElementById("seconds");
  const elBanner = document.getElementById("arrived-banner");
  const elBox = document.getElementById("countdown-box");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = TET_TARGET - now;

    if (diff <= 0) {
      elBox.classList.add("hidden");
      elBanner.classList.remove("hidden");
      elDays.textContent = "00";
      elHours.textContent = "00";
      elMinutes.textContent = "00";
      elSeconds.textContent = "00";
      document.title = "🎉 Chúc Mừng Năm Mới Đinh Mùi 2027!";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);

    document.title = `🧧 ${days} ngày ${pad(hours)}:${pad(minutes)}:${pad(seconds)} đến Tết 2027`;
  }

  // ---------- 2. NGÀY DƯƠNG LỊCH HIỆN TẠI ----------
  const WEEKDAYS_VI = [
    "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư",
    "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
  ];

  function updateSolarDate() {
    const now = new Date();
    const wd = WEEKDAYS_VI[now.getDay()];
    const d = now.getDate();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();
    document.getElementById("solar-date").textContent =
      `${wd}, ${pad(d)}/${pad(m)}/${y}`;
  }

  // ---------- 3. CHUYỂN ĐỔI ÂM LỊCH (thuật toán thiên văn) ----------
  // Dựa trên thuật toán tính lịch âm dương truyền thống cho múi giờ
  // Việt Nam (UTC+7), dùng số ngày Julian.

  function jdFromDate(dd, mm, yy) {
    const a = Math.floor((14 - mm) / 12);
    const y = yy + 4800 - a;
    const m = mm + 12 * a - 3;
    let jd =
      dd +
      Math.floor((153 * m + 2) / 5) +
      365 * y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) -
      32045;
    if (jd < 2299161) {
      jd =
        dd +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        32083;
    }
    return jd;
  }

  function jdToDate(jd) {
    let a, b, c;
    if (jd > 2299160) {
      a = jd + 32044;
      b = Math.floor((4 * a + 3) / 146097);
      c = a - Math.floor((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = b * 100 + d - 4800 + Math.floor(m / 10);
    return [day, month, year];
  }

  function NewMoon(k) {
    const T = k / 1236.85;
    const T2 = T * T;
    const T3 = T2 * T;
    const dr = Math.PI / 180;
    let Jd1 =
      2415020.75933 +
      29.53058868 * k +
      0.0001178 * T2 -
      0.000000155 * T3;
    Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 =
      (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
      0.0021 * Math.sin(2 * dr * M);
    C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 += 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    let deltat;
    if (T < -11) {
      deltat =
        0.001 +
        0.000839 * T +
        0.0002261 * T2 -
        0.00000845 * T3 -
        0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    }
    const JdNew = Jd1 + C1 - deltat;
    return JdNew;
  }

  function SunLongitude(jdn) {
    const T = (jdn - 2451545.0) / 36525;
    const T2 = T * T;
    const dr = Math.PI / 180;
    const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL =
      (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL +=
      (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) +
      0.00029 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return L;
  }

  function getSunLongitude(dayNumber, timeZone) {
    return Math.floor(
      (SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6
    );
  }

  function getNewMoonDay(k, timeZone) {
    return Math.floor(NewMoon(k) + 0.5 + timeZone / 24);
  }

  function getLunarMonth11(yy, timeZone) {
    const off = jdFromDate(31, 12, yy) - 2415021;
    const k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    const sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  function getLeapMonthOffset(a11, timeZone) {
    const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  function convertSolar2Lunar(dd, mm, yy, timeZone) {
    const dayNumber = jdFromDate(dd, mm, yy);
    const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    const lunarDay = dayNumber - monthStart + 1;
    const diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return [lunarDay, lunarMonth, lunarYear, lunarLeap];
  }

  const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  const CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

  function canChiYear(y) {
    return `${CAN[(y + 6) % 10]} ${CHI[(y + 8) % 12]}`;
  }

  function updateLunarDate() {
    const now = new Date();
    const [ld, lm, ly, leap] = convertSolar2Lunar(
      now.getDate(),
      now.getMonth() + 1,
      now.getFullYear(),
      7
    );
    const leapTxt = leap ? " (nhuận)" : "";
    document.getElementById("lunar-date").textContent =
      `${pad(ld)}/${pad(lm)}${leapTxt} năm ${canChiYear(ly)} (${ly})`;
  }

  // ---------- 4. HIỆU ỨNG NỀN: HOA RƠI + PHÁO HOA NHẸ ----------
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Cánh hoa mai/đào rơi nhẹ nhàng
  const PETAL_COLORS = ["#ffd166", "#ffe3a3", "#ff8fa3", "#ffb3c6"];
  const petals = [];
  const PETAL_COUNT = window.innerWidth < 500 ? 18 : 32;

  function makePetal() {
    return {
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 4 + Math.random() * 5,
      speedY: 0.4 + Math.random() * 0.9,
      speedX: Math.sin(Math.random() * Math.PI) * 0.6,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: 0.01 + Math.random() * 0.02,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03
    };
  }
  for (let i = 0; i < PETAL_COUNT; i++) petals.push(makePetal());

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Pháo hoa nhẹ: các đốm sáng thỉnh thoảng nổ ra
  let fireworks = [];
  function spawnFirework() {
    const x = Math.random() * W * 0.8 + W * 0.1;
    const y = Math.random() * H * 0.5 + 20;
    const hueColors = ["#ffd166", "#ff595e", "#ffe066", "#ff8fa3", "#ffffff"];
    const particles = [];
    const count = 18 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: hueColors[Math.floor(Math.random() * hueColors.length)]
      });
    }
    fireworks.push({ particles, age: 0 });
  }

  let lastFireworkTime = 0;

  function animate(ts) {
    ctx.clearRect(0, 0, W, H);

    // hoa rơi
    for (const p of petals) {
      p.swing += p.swingSpeed;
      p.x += p.speedX + Math.sin(p.swing) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y > H + 10) {
        p.y = -10;
        p.x = Math.random() * W;
      }
      if (p.x > W + 10) p.x = -10;
      if (p.x < -10) p.x = W + 10;
      drawPetal(p);
    }

    // pháo hoa
    if (!lastFireworkTime || ts - lastFireworkTime > 2600) {
      lastFireworkTime = ts;
      if (Math.random() > 0.25) spawnFirework();
    }

    fireworks.forEach((fw) => {
      fw.age += 1;
      fw.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.02; // gravity nhẹ
        pt.life -= 0.02;
        if (pt.life > 0) {
          ctx.globalAlpha = Math.max(pt.life, 0);
          ctx.fillStyle = pt.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      });
    });
    fireworks = fireworks.filter((fw) => fw.particles.some((pt) => pt.life > 0));

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // ---------- 5. KHỞI CHẠY ----------
  updateCountdown();
  updateSolarDate();
  updateLunarDate();
  setInterval(updateCountdown, 1000);
  setInterval(updateSolarDate, 1000 * 30);
  setInterval(updateLunarDate, 1000 * 60);
})();