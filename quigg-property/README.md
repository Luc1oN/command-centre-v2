# Quigg Property Website

A standalone static website for Quigg Property (Cork estate agents), built with plain HTML/CSS/JS — no build step required. Lives in this repo as an isolated subdirectory, independent of the Command Centre app.

## Structure

- `index.html` — Home page (hero, search, featured listings, values, testimonials)
- `listings.html` — Full property listings with client-side filtering
- `listing.html` — Individual property detail page (reads `?id=` from `assets/listings-data.js`)
- `about.html` — Agency story, values and team
- `contact.html` — Enquiry form, contact details, map
- `assets/styles.css` — Shared brand styling (navy/gold palette, Cormorant Garamond + Montserrat)
- `assets/script.js` — Mobile nav toggle, listings filter, static form handling
- `assets/footer.js` — Shared footer markup injected on every page
- `assets/listings-data.js` — Sample property data (swap for a real feed/CMS later)
- `assets/logo.svg` — Vector recreation of the Quigg Property lighthouse mark

## Branding

Colour palette, typography and voice follow the supplied Quigg Property brand sheet:

- Deep Navy `#0B2341`, Antique Gold `#C8A45A`, Clean White `#FFFFFF`, Slate Grey `#6B6F76`
- Heading font: Cormorant Garamond (serif, standing in for Trajan Pro on the web)
- Body font: Montserrat
- Tagline: "Trusted. Local. Results."

Layout and UX (sticky nav, hero search bar, filterable listing grid, agent sidebar on property pages) are modelled on brestateagent.ie, replacing its content with Quigg Property's branding and Cork-focused copy.

## Running locally

No build step needed — just serve the folder:

```
cd quigg-property
python3 -m http.server 8080
```

Then open http://localhost:8080

## Next steps for production

- Swap `assets/listings-data.js` for a real property feed (MyHome.ie/Daft API, CMS, or Supabase table)
- Replace stock Unsplash imagery with real property and team photography
- Wire the contact form to a real email/CRM endpoint
- Add a proper sitemap.xml/robots.txt and analytics before going live
