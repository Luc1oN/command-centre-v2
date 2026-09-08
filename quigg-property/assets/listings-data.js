const QUIGG_LISTINGS = [
  {
    id: 'cobh-harbour-view',
    title: 'Harbour View Residence',
    location: 'Westbourne Place, Cobh, Co. Cork',
    price: 495000,
    type: 'sale',
    beds: 4,
    baths: 3,
    area: '186 sqm',
    tag: 'For Sale',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    summary: 'A striking four-bedroom period residence with uninterrupted views over Cork Harbour, fully restored with a contemporary interior.'
  },
  {
    id: 'midleton-family-home',
    title: 'The Orchards',
    location: 'Ballinacurra Road, Midleton, Co. Cork',
    price: 375000,
    type: 'sale',
    beds: 3,
    baths: 2,
    area: '128 sqm',
    tag: 'For Sale',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop',
    summary: 'Spacious three-bedroom family home on a quiet cul-de-sac, walking distance to Midleton town centre and schools.'
  },
  {
    id: 'crosshaven-cottage',
    title: 'Anchor Point Cottage',
    location: 'Church Bay, Crosshaven, Co. Cork',
    price: 610000,
    type: 'sale',
    beds: 3,
    baths: 2,
    area: '142 sqm',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    summary: 'Charming waterside cottage moments from the marina, tastefully renovated with a private garden and sea views.'
  },
  {
    id: 'cork-city-apartment',
    title: 'Lapps Quay Apartment',
    location: 'Lapps Quay, Cork City',
    price: 1750,
    type: 'rent',
    beds: 2,
    baths: 2,
    area: '84 sqm',
    tag: 'To Let',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    summary: 'Modern two-bedroom riverside apartment in the heart of Cork City, close to shops, restaurants and transport links.'
  },
  {
    id: 'carrigaline-new-build',
    title: 'Woodview Grove No. 12',
    location: 'Carrigaline, Co. Cork',
    price: 425000,
    type: 'sale',
    beds: 4,
    baths: 3,
    area: '155 sqm',
    tag: 'For Sale',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1200&auto=format&fit=crop',
    summary: 'Energy-efficient A-rated new build in a sought-after development, close to Carrigaline village and amenities.'
  },
  {
    id: 'monkstown-period',
    title: 'The Lighthouse Keeper\'s House',
    location: 'The Pier, Monkstown, Co. Cork',
    price: 850000,
    type: 'sale',
    beds: 5,
    baths: 4,
    area: '240 sqm',
    tag: 'Featured',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
    summary: 'An exceptional period residence steeped in maritime history, offering commanding views across the harbour.'
  },
  {
    id: 'glanmire-townhouse',
    title: 'Riverside Townhouse',
    location: 'Glanmire, Co. Cork',
    price: 1450,
    type: 'rent',
    beds: 3,
    baths: 2,
    area: '110 sqm',
    tag: 'To Let',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop',
    summary: 'Well-presented three-bedroom townhouse close to the river walk, ideal for commuters into Cork City.'
  },
  {
    id: 'kinsale-coastal',
    title: 'Compass Point Villa',
    location: 'Scilly, Kinsale, Co. Cork',
    price: 975000,
    type: 'sale',
    beds: 5,
    baths: 4,
    area: '265 sqm',
    tag: 'Luxury',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    summary: 'A rare coastal villa above Kinsale harbour, with landscaped gardens and panoramic sea views from every level.'
  },
  {
    id: 'douglas-bungalow',
    title: 'Maple Lane Bungalow',
    location: 'Douglas, Cork',
    price: 340000,
    type: 'sale',
    beds: 3,
    baths: 1,
    area: '105 sqm',
    tag: 'For Sale',
    image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=1200&auto=format&fit=crop',
    summary: 'Well-maintained three-bedroom bungalow on a generous site, close to Douglas village and shopping centre.'
  }
];

function euro(n, type) {
  const formatted = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
  return type === 'rent' ? `${formatted} / month` : formatted;
}
