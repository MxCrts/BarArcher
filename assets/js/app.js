/* Le Bar des Archers — script unique, sans dépendance.
   Périmètre : badge ouvert/fermé, horaires, galerie, révélations, barre d'actions. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var doux = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= 1. Horaires ================= */

  var NOMS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  function enMinutes(hhmm) {
    var p = String(hhmm).split(":");
    return (+p[0] || 0) * 60 + (+p[1] || 0);
  }

  /* 840 -> « 14h », 0 -> « minuit », 720 -> « midi » */
  function enHeure(m) {
    m = ((m % 1440) + 1440) % 1440;
    if (m === 0) return "minuit";
    if (m === 720) return "midi";
    var h = Math.floor(m / 60), n = m % 60;
    return n ? h + "h" + (n < 10 ? "0" + n : n) : h + "h";
  }

  /* Semaine par défaut : lue sur le tableau déjà présent dans la page.
     Fonctionne donc aussi en ouvrant index.html d'un double-clic (file://),
     où fetch() est bloqué. data/horaires.json prend le relais dès qu'il est lisible. */
  function semaineDepuisTableau() {
    var semaine = {};
    $$("tr[data-iso]").forEach(function (tr) {
      var brut = tr.getAttribute("data-creneaux") || "";
      semaine[+tr.getAttribute("data-iso")] = brut ? brut.split(",").map(function (c) {
        var b = c.trim().split("-");
        return { o: enMinutes(b[0]), f: enMinutes(b[1]) };
      }) : [];
    });
    return semaine;
  }

  function semaineDepuisJson(data) {
    var semaine = {};
    (data.jours || []).forEach(function (j) {
      semaine[+j.iso] = (j.creneaux || []).map(function (c) {
        return { o: enMinutes(c.ouverture), f: enMinutes(c.fermeture) };
      });
    });
    return semaine;
  }

  /* Instant courant à Paris, quelle que soit l'heure de l'appareil. */
  function maintenantParis() {
    try {
      var fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Paris", year: "numeric", month: "2-digit",
        day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
      });
      var p = {};
      fmt.formatToParts(new Date()).forEach(function (o) { p[o.type] = o.value; });
      var jsJour = new Date(Date.UTC(+p.year, +p.month - 1, +p.day)).getUTCDay();
      return { iso: jsJour === 0 ? 7 : jsJour, min: (+p.hour % 24) * 60 + (+p.minute) };
    } catch (e) {
      var d = new Date();
      return { iso: d.getDay() === 0 ? 7 : d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  var veille = function (iso) { return iso === 1 ? 7 : iso - 1; };
  var lendemain = function (iso) { return iso === 7 ? 1 : iso + 1; };

  /* Un créneau dont la fermeture est <= à l'ouverture passe minuit (16h -> 00h). */
  function statut(semaine, iso, min) {
    var creneauxVeille = semaine[veille(iso)] || [];
    for (var i = 0; i < creneauxVeille.length; i++) {
      var cv = creneauxVeille[i];
      if (cv.f <= cv.o && min < cv.f) return { ouvert: true, fin: cv.f };
    }
    var duJour = semaine[iso] || [];
    for (var k = 0; k < duJour.length; k++) {
      var c = duJour[k];
      var fin = c.f <= c.o ? c.f + 1440 : c.f;
      if (min >= c.o && min < fin) return { ouvert: true, fin: c.f };
    }
    for (var d = 0; d < 8; d++) {
      var j = iso, n = d;
      while (n--) j = lendemain(j);
      var liste = (semaine[j] || []).slice().sort(function (a, b) { return a.o - b.o; });
      for (var q = 0; q < liste.length; q++) {
        if (d > 0 || liste[q].o > min) return { ouvert: false, decalage: d, jour: j, debut: liste[q].o };
      }
    }
    return { ouvert: false };
  }

  function phrase(s) {
    if (s.ouvert) return "ferme à " + enHeure(s.fin);
    if (typeof s.debut !== "number") return "horaires publiés sur Instagram";
    var quand = s.decalage === 0 ? "" : s.decalage === 1 ? "demain " : NOMS[s.jour].toLowerCase() + " ";
    return "ouvre " + quand + "à " + enHeure(s.debut);
  }

  function texteCreneaux(liste) {
    if (!liste || !liste.length) return null;
    return liste.map(function (c) { return enHeure(c.o) + " – " + enHeure(c.f); }).join(" et ");
  }

  function appliquer(semaine) {
    var now = maintenantParis();

    /* a. badge du hero */
    var badge = $("#badge");
    if (badge) {
      var s = statut(semaine, now.iso, now.min);
      badge.setAttribute("data-etat", s.ouvert ? "ouvert" : "ferme");
      $(".badge__etat", badge).textContent = s.ouvert ? "Ouvert" : "Fermé";
      $(".badge__detail", badge).textContent = phrase(s);
      badge.setAttribute("aria-label",
        "Le bar est " + (s.ouvert ? "ouvert" : "fermé") + " en ce moment, il " + phrase(s) + ".");
    }

    /* b. ligne « aujourd'hui » du bandeau */
    var duJour = $("#horaires-du-jour");
    if (duJour) {
      var t = texteCreneaux(semaine[now.iso]);
      duJour.textContent = t ? t : "Fermé aujourd'hui";
    }

    /* c. tableau : mise à jour et surlignage du jour courant */
    $$("tr[data-iso]").forEach(function (tr) {
      var iso = +tr.getAttribute("data-iso");
      var cell = tr.cells[1];
      var t = texteCreneaux(semaine[iso]);
      if (cell) {
        cell.textContent = t || "Fermé";
        cell.className = t ? "" : "ferme";
      }
      if (iso === now.iso) tr.setAttribute("data-aujourdhui", ""); else tr.removeAttribute("data-aujourdhui");
    });
  }

  function demarrerHoraires() {
    var semaine = semaineDepuisTableau();
    appliquer(semaine);
    /* rafraîchissement à chaque minute pleine : le badge ne ment jamais */
    setInterval(function () { appliquer(semaine); }, 60000);

    if (window.fetch && location.protocol !== "file:") {
      fetch("data/horaires.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data || !data.jours) return;
          semaine = semaineDepuisJson(data);
          appliquer(semaine);
        })
        .catch(function () { /* le tableau de la page reste la référence */ });
    }
  }

  /* ================= 2. Galerie ================= */

  function demarrerGalerie() {
    var dlg = $("#lightbox");
    var boutons = $$(".galerie__bouton");
    if (!dlg || !boutons.length || !dlg.showModal) return;

    var img = $("#lightbox-img"), leg = $("#lightbox-legende"), cpt = $("#lightbox-compteur");
    var index = 0, declencheur = null;

    function montrer(i) {
      index = (i + boutons.length) % boutons.length;
      var b = boutons[index];
      img.src = b.getAttribute("data-grand");
      img.alt = b.getAttribute("data-alt") || "";
      img.width = +b.getAttribute("data-w") || 0;
      img.height = +b.getAttribute("data-h") || 0;
      leg.textContent = b.getAttribute("data-legende") || "";
      cpt.textContent = (index + 1) + " / " + boutons.length;
    }

    boutons.forEach(function (b, i) {
      b.addEventListener("click", function () {
        declencheur = b;
        montrer(i);
        dlg.showModal();
      });
    });

    $("#lightbox-prec").addEventListener("click", function () { montrer(index - 1); });
    $("#lightbox-suiv").addEventListener("click", function () { montrer(index + 1); });
    $("#lightbox-fermer").addEventListener("click", function () { dlg.close(); });

    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); montrer(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); montrer(index + 1); }
    });
    dlg.addEventListener("close", function () {
      img.removeAttribute("src");
      if (declencheur) declencheur.focus();
    });

    var x0 = null;
    dlg.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) montrer(index + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ================= 3. Révélations ================= */

  function demarrerRevelations() {
    var cibles = $$(".reveler");
    if (!cibles.length) return;
    if (doux || !("IntersectionObserver" in window)) {
      cibles.forEach(function (el) { el.setAttribute("data-vu", ""); });
      return;
    }
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.setAttribute("data-vu", ""); obs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    cibles.forEach(function (el) { obs.observe(el); });
  }

  /* ================= 4. Barre d'actions mobile ================= */

  function demarrerBarre() {
    var barre = $("#actions"), hero = $("#hero");
    if (!barre || !hero) return;
    if (!("IntersectionObserver" in window)) { barre.removeAttribute("data-cache"); return; }
    new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        barre.toggleAttribute("data-cache", e.intersectionRatio > 0.35);
      });
    }, { threshold: [0, 0.35, 1] }).observe(hero);
  }

  /* ================= 5. Démarrage ================= */

  function demarrer() {
    demarrerHoraires();
    demarrerGalerie();
    demarrerRevelations();
    demarrerBarre();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
