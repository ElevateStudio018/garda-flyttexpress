# Gårda Flyttexpress – ny hemsida

Statisk hemsida (HTML/CSS/JS, inga byggsteg) för **Gårda Flyttexpress AB**, flyttfirma i Göteborg.

## Struktur

```
index.html              Startsida (hero, tjänster, varför oss, process, team, omdömen, trygghet, FAQ, offertformulär)
integritetspolicy.html  GDPR-information
css/style.css           All styling
js/main.js              Header, mobilmeny, FAQ, hero-video, offertformulär
assets/img/             Logotyp (svart/vit/transparent), foton från verksamheten, badges
assets/video/           Hero-video (hero.mp4 1080p, hero-720.mp4 för mobil)
assets/partners/        Samarbetspartners logotyper
```

## Publicering

Allt är statiskt och kan läggas direkt på valfritt webbhotell, Netlify, Vercel eller GitHub Pages
(Settings → Pages → Deploy from branch `main`, root).

## Offertformuläret

Formuläret har ingen egen backend. I `js/main.js` finns `FORM_ENDPOINT`:

- **Tomt (standard):** besökarens e-postprogram öppnas med förfrågan färdigifylld till `info@gardaflyttexpress.se`.
- **Satt till en endpoint** (t.ex. Formspree, Formsubmit, Netlify Forms eller egen funktion) skickas förfrågan som JSON med POST,
  och besökaren får bekräftelse direkt på sidan.

## Hero-videon

`assets/video/hero.mp4` är byggd av företagets egna foton (flyttbilarna och personal under flyttuppdrag) med långsam
panorering och övertoningar. Byt ut mot filmat material när sådant finns – det räcker att ersätta mp4-filerna
(16:9, gärna 10–20 s, utan ljud) och `assets/img/hero-poster.jpg`.

## Källor för innehållet

- Texter, tjänster, villkor och kontaktuppgifter: gardaflyttexpress.se (samtliga undersidor)
- Kundomdömen, snittbetyg (4,9/5), antal omdömen (326) och utmärkelser: reco.se/garda-flyttexpress-ab (hämtat 2026-10-30)
- Adress, organisationsnummer, VD och styrelse: Allabolag/Bolagsverket-register
- Personalnamn i teamsektionen: företagets egna svar på Reco samt bildfilnamn på nuvarande hemsida

Inga priser, garantier eller certifieringar har lagts till utöver vad företaget själva uppger.
