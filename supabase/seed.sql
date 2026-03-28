-- =============================================
-- ICO Website — Seed Data
-- =============================================

-- -------------------------------------------
-- DIENSTEN — volledig ICO-catalogus
-- -------------------------------------------

-- Verwijder bestaande diensten (bij herinstallatie)
TRUNCATE services RESTART IDENTITY CASCADE;

-- ===== CATEGORIE: WASH =====

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, pricing_tiers, sort_order) VALUES
(
    'easywash',
    'EasyWash',
    'EasyWash',
    'Grondige buitenreiniging van uw voertuig — karosserie, velgen, banden en ramen van buiten. Snel en professioneel uitgevoerd door het ICO team. Ideaal voor regelmatig onderhoud.',
    'Thorough exterior cleaning of your vehicle — bodywork, rims, tyres and windows outside. Fast and professional, carried out by the ICO team. Ideal for regular maintenance.',
    'Exterieur reiniging — karosserie, velgen, banden en ramen.',
    'Exterior clean — bodywork, rims, tyres and windows.',
    55.00,
    60,
    'Droplets',
    'wash',
    '[
        {"vehicle_type": "standaard", "label": "Standaard wagen", "price": 55},
        {"vehicle_type": "groot", "label": "Grote wagen", "price": 60},
        {"vehicle_type": "xl_suv", "label": "XL / SUV", "price": 70},
        {"vehicle_type": "bestelwagen_standaard", "label": "Bestelwagen standaard", "price": 70},
        {"vehicle_type": "bestelwagen_groot", "label": "Bestelwagen groot", "price": 80},
        {"vehicle_type": "bestelwagen_xl", "label": "Bestelwagen XL", "price": 90}
    ]'::jsonb,
    1
),
(
    'detailwash',
    'DetailWash',
    'DetailWash',
    'Onze premium wasbeurt met oog voor elk detail. Volledig exterieur én interieur grondig gereinigd. Karosserie, velgen, banden, ramen (in & buiten), interieur gestofzuigd, dashboard en kunststoffen behandeld. Gemiddeld ~2 uur met 2 personen.',
    'Our premium wash with attention to every detail. Full exterior and interior thoroughly cleaned. Bodywork, rims, tyres, windows (in & out), interior vacuumed, dashboard and plastics treated. Average ~2 hours with 2 people.',
    'Volledige premium wasbeurt — exterieur én interieur. ~2 uur.',
    'Full premium wash — exterior and interior. ~2 hours.',
    85.00,
    120,
    'Sparkles',
    'wash',
    '[
        {"vehicle_type": "standaard", "label": "Standaard wagen", "price": 85},
        {"vehicle_type": "groot", "label": "Grote wagen", "price": 90},
        {"vehicle_type": "xl_suv", "label": "XL / SUV", "price": 100},
        {"vehicle_type": "bestelwagen_standaard", "label": "Bestelwagen standaard", "price": 100},
        {"vehicle_type": "bestelwagen_groot", "label": "Bestelwagen groot", "price": 120},
        {"vehicle_type": "bestelwagen_xl", "label": "Bestelwagen XL", "price": 140}
    ]'::jsonb,
    2
);

-- ===== CATEGORIE: EXTRA =====

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'extra-dieptereiniging',
    'Dieptereiniging',
    'Deep Cleaning',
    'Intensieve reiniging van zetels en tapijten met professionele sproei- en extractiemachine. Verwijdert hardnekkig vuil, vlekken en geuren. Aanbevolen in combinatie met een DetailWash.',
    'Intensive cleaning of seats and carpets with a professional spray and extraction machine. Removes stubborn dirt, stains and odours. Recommended in combination with a DetailWash.',
    'Sproei- en extractiereiniging van zetels & tapijten.',
    'Spray and extraction cleaning of seats & carpets.',
    150.00,
    90,
    'Armchair',
    'extra',
    10
),
(
    'extra-steam-wash',
    'Steam Wash',
    'Steam Wash',
    'Grondige stoomreiniging van het volledige interieur. Effectief tegen bacteriën, vlekken en hardnekkig vuil — zonder agressieve chemicaliën. Veilig voor alle oppervlakken.',
    'Thorough steam cleaning of the full interior. Effective against bacteria, stains and stubborn dirt — without aggressive chemicals. Safe for all surfaces.',
    'Stoomreiniging van het volledige interieur.',
    'Steam cleaning of the full interior.',
    150.00,
    90,
    'Wind',
    'extra',
    11
),
(
    'extra-car-polish',
    'Car Polish',
    'Car Polish',
    'Volledige 3-staps polijstbehandeling van de carrosserie. Verwijdert krassen, oxidatie en swirl marks voor een diepglanzende, als-nieuw lak. Professioneel resultaat.',
    'Full 3-step polish treatment of the bodywork. Removes scratches, oxidation and swirl marks for a deep-gloss, like-new finish. Professional result.',
    'Volledige 3-staps polijstbehandeling.',
    'Full 3-step polish treatment.',
    550.00,
    480,
    'Sparkle',
    'extra',
    12
),
(
    'extra-hyper-screen-wash',
    'Hyper Screen Wash',
    'Hyper Screen Wash',
    'Toevoeging van professionele hydrofobe ruitenvloeistof. Water parelt van de ramen — betere zichtbaarheid bij regen en minder poetsen nodig.',
    'Application of professional hydrophobic screen wash. Water beads off the windows — better visibility in rain and less cleaning required.',
    'Hydrofobe ruitenvloeistof — water pareert van uw ramen.',
    'Hydrophobic screen wash — water beads off your windows.',
    10.00,
    15,
    'GlassWater',
    'extra',
    13
),
(
    'extra-airco-clean',
    'Airco Clean',
    'Airco Clean',
    'Effectieve reiniging en ontsmetting van het airco- en verwarmingssysteem. Elimineert bacteriën, schimmels en onaangename geuren uit het ventilatiesysteem voor frisse lucht in uw interieur.',
    'Effective cleaning and disinfection of the air conditioning and heating system. Eliminates bacteria, mould and unpleasant odours from the ventilation system for fresh air in your interior.',
    'Reiniging en ontsmetting van airco & verwarming.',
    'Cleaning and disinfection of air conditioning & heating.',
    20.00,
    20,
    'Wind',
    'extra',
    14
);

-- ===== CATEGORIE: COATING =====

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'leather-coating',
    'Leather Coating',
    'Leather Coating',
    'Beschermende Carbon Collective keramische coating voor leren zetels. Carbon Collective staat bekend als een van de meest premium coatingmerken ter wereld. Voorkomt uitdroging, scheuren en verkleuring. Maakt leder gemakkelijk schoon te houden en houdt het soepel en mooi.',
    'Protective Carbon Collective ceramic coating for leather seats. Carbon Collective is known as one of the most premium coating brands in the world. Prevents drying out, cracking and discolouration. Makes leather easy to clean and keeps it supple and beautiful.',
    'Carbon Collective keramische bescherming voor leren zetels.',
    'Carbon Collective ceramic protection for leather seats.',
    350.00,
    180,
    'Armchair',
    'coating',
    20
),
(
    'window-coating',
    'Window Coating',
    'Window Coating',
    'Carbon Collective Window Coating — professionele hydrofobe coating voor alle ramen. Maakt ramen 100% waterafstotend: water parelt onmiddellijk van het glas. Betere zichtbaarheid bij regen, minder poetsen en langdurige bescherming dankzij Carbon Collective technologie.',
    'Carbon Collective Window Coating — professional hydrophobic coating for all windows. Makes windows 100% water-repellent: water immediately beads off the glass. Better visibility in rain, less cleaning and long-lasting protection thanks to Carbon Collective technology.',
    'Carbon Collective Window Coating — 100% waterafstotend.',
    'Carbon Collective Window Coating — 100% water-repellent.',
    200.00,
    120,
    'GlassWater',
    'coating',
    21
),
(
    'wheels-coating',
    'Wheels Coating',
    'Wheels Coating',
    'Carbon Collective Platinum Ceramic Coating voor de velgen. Beschermt intensief tegen remstofresten, hitte en wegvuil. Velgen blijven aanzienlijk langer proper en zijn in een handomdraai te reinigen. Langdurige diepe glans en topbescherming.',
    'Carbon Collective Platinum Ceramic Coating for the rims. Provides intensive protection against brake dust, heat and road dirt. Rims stay noticeably cleaner longer and are quick to clean. Long-lasting deep shine and top protection.',
    'Carbon Collective Platinum Ceramic Coating voor duurzame velgenbescherming.',
    'Carbon Collective Platinum Ceramic Coating for long-lasting rim protection.',
    350.00,
    120,
    'Circle',
    'coating',
    22
),
(
    'carrosserie-coating',
    'Carrosserie Coating',
    'Carrosserie Coating',
    '2-laags Carbon Collective Diamond Infused Ceramic Coating van de volledige carrosserie. Carbon Collective is een van de meest gerenommeerde coatingmerken ter wereld — hun Diamond Infused formule biedt superieure lakbescherming met hydrofobisch effect, UV-bescherming en een ongeëvenaarde diepe glans. Inclusief grondige lakvoorbereiding.',
    '2-layer Carbon Collective Diamond Infused Ceramic Coating of the full bodywork. Carbon Collective is one of the most renowned coating brands in the world — their Diamond Infused formula provides superior paint protection with hydrophobic effect, UV protection and an unmatched deep gloss. Including thorough paint preparation.',
    '2-laags Carbon Collective Diamond Infused Ceramic Coating — volledige carrosserie.',
    '2-layer Carbon Collective Diamond Infused Ceramic Coating — full bodywork.',
    850.00,
    480,
    'Shield',
    'coating',
    23
),
(
    'extra-carrosserie-coating',
    'Extra Carrosserie Coating',
    'Extra Carrosserie Coating',
    '3de laag Carbon Collective Self Healing Diamond Infused Ceramic Coating als upgrade op de Carrosserie Coating. De zelfherstellende formule van Carbon Collective biedt extra bescherming tegen fijne krassen en steenslag — uw lak herstelt zichzelf bij lichte beschadigingen.',
    '3rd layer Carbon Collective Self Healing Diamond Infused Ceramic Coating as an upgrade to the Carrosserie Coating. Carbon Collective''s self-healing formula provides extra protection against fine scratches and stone chips — your paint repairs itself after light damage.',
    'Carbon Collective Self Healing 3de coatinglaag — upgrade op Carrosserie Coating.',
    'Carbon Collective Self Healing 3rd coating layer — upgrade on Carrosserie Coating.',
    300.00,
    120,
    'ShieldCheck',
    'coating',
    24
);

-- ===== CATEGORIE: PPF (Paint Protection Film) =====

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'ppf-anti-fingerprint',
    'Anti-Fingerprint PPF',
    'Anti-Fingerprint PPF',
    'PPF folie speciaal voor multimediaschermpanelen en touchscreens in het voertuig. Beschermt tegen vingerafdrukken, krassen en slijtage. Nauwelijks zichtbaar.',
    'PPF film specially for multimedia screen panels and touchscreens in the vehicle. Protects against fingerprints, scratches and wear. Barely visible.',
    'PPF folie voor multimediaschermpanelen.',
    'PPF film for multimedia screen panels.',
    75.00,
    60,
    'Square',
    'ppf',
    30
),
(
    'ppf-windshield',
    'Windshield Protection',
    'Windshield Protection',
    'Bescherming van de voorruit met PPF. Beschermt tegen steenslag, insecten en fijne krassen. Verbetert de zichtbaarheid niet maar beschermt de ruit langdurig.',
    'Protection of the windshield with PPF. Protects against stone chips, insects and fine scratches. Does not improve visibility but protects the glass long-term.',
    'PPF folie voor de voorruit.',
    'PPF film for the windshield.',
    350.00,
    180,
    'Eye',
    'ppf',
    31
),
(
    'ppf-full-front',
    'Full Front PPF',
    'Full Front PPF',
    'Volledige frontbescherming: motorkap, zijvleugels en voorbumper volledig ingepakt met PPF. Beschermt de meest kwetsbare zones van uw wagen tegen steenslag, insecten en dagelijkse schade.',
    'Full front protection: bonnet, side wings and front bumper fully wrapped in PPF. Protects the most vulnerable zones of your car against stone chips, insects and daily damage.',
    'Motorkap, zijvleugels en voorbumper in PPF.',
    'Bonnet, side wings and front bumper in PPF.',
    1850.00,
    600,
    'Layers',
    'ppf',
    32
),
(
    'ppf-full-package',
    'Full Package PPF',
    'Full Package PPF',
    'Volledige voertuigbescherming met PPF. Elk paneel van uw wagen wordt ingepakt met hoogwaardige zelfherstellende PPF folie. De ultieme bescherming voor uw investering.',
    'Full vehicle protection with PPF. Every panel of your car is wrapped in high-quality self-healing PPF film. The ultimate protection for your investment.',
    'Volledige wagen beschermd in PPF — de ultieme bescherming.',
    'Full vehicle wrapped in PPF — the ultimate protection.',
    4900.00,
    NULL,
    'Shield',
    'ppf',
    33
),
(
    'ppf-headlight',
    'Headlight Protection',
    'Headlight Protection',
    'Bescherming van de koplampen met PPF. Koplampen zijn bijzonder vatbaar voor steen slag en UV-schade. PPF houdt ze helder en in perfecte staat.',
    'Protection of the headlights with PPF. Headlights are particularly susceptible to stone chips and UV damage. PPF keeps them clear and in perfect condition.',
    'PPF folie voor de koplampen.',
    'PPF film for the headlights.',
    200.00,
    120,
    'Eye',
    'ppf',
    34
);

-- ===== CATEGORIE: HOME CARE =====

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'homecare',
    'Home Care',
    'Home Care',
    'Professioneel advies en demonstratie voor het thuisonderhoud van uw voertuig. Leer de correcte wasprocedure, de beste producten en technieken voor thuis. Binnenkort ook meer home care services!',
    'Professional advice and demonstration for home maintenance of your vehicle. Learn the correct washing procedure, the best products and techniques for home use. More home care services coming soon!',
    'Professioneel thuisonderhoudsadvies — binnenkort meer!',
    'Professional home maintenance advice — more coming soon!',
    NULL,
    60,
    'Home',
    'homecare',
    40
);

-- -------------------------------------------
-- SERVICE FOTO'S
-- -------------------------------------------
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'easywash';
UPDATE services SET image_url = '/images/nico-exterieur-behandeling.jpg'  WHERE slug = 'detailwash';
UPDATE services SET image_url = '/images/audi-rs-zetels-detail.jpg'       WHERE slug = 'extra-dieptereiniging';
UPDATE services SET image_url = '/images/bmw-interieur-detail.jpg'        WHERE slug = 'extra-steam-wash';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg' WHERE slug = 'extra-car-polish';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg' WHERE slug = 'extra-hyper-screen-wash';
UPDATE services SET image_url = '/images/rico-interieur-reiniging.jpg'    WHERE slug = 'extra-airco-clean';
UPDATE services SET image_url = '/images/audi-rs-zetels-detail.jpg'       WHERE slug = 'leather-coating';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg' WHERE slug = 'window-coating';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'wheels-coating';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg' WHERE slug = 'carrosserie-coating';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'extra-carrosserie-coating';
UPDATE services SET image_url = '/images/bmw-interieur-detail.jpg'        WHERE slug = 'ppf-anti-fingerprint';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg' WHERE slug = 'ppf-windshield';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'ppf-full-front';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'ppf-full-package';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'      WHERE slug = 'ppf-headlight';
UPDATE services SET image_url = '/images/opel-gt-washbus.jpg'             WHERE slug = 'homecare';

-- -------------------------------------------
-- PRODUCTEN (CleanTech)
-- -------------------------------------------
INSERT INTO products (slug, name, description_nl, description_en, price, category, stock_quantity, sort_order) VALUES
(
    'cleantech-ceramicmax',
    'CleanTech | CeramicMax',
    'Professionele keramische coating spray voor langdurige bescherming en diepe glans.',
    'Professional ceramic coating spray for long-lasting protection and deep shine.',
    7.50,
    'coating',
    50,
    1
),
(
    'cleantech-fibermax',
    'CleanTech | FiberMax',
    'Hoogwaardige microvezel doek voor streepvrij drogen en polijsten.',
    'Premium microfiber cloth for streak-free drying and polishing.',
    5.00,
    'droogdoek',
    100,
    2
),
(
    'cleantech-dryer-plus',
    'CleanTech | Dryer+',
    'Professionele droogdoek met extra absorptievermogen. Perfect voor het drogen van uw voertuig na een wasbeurt.',
    'Professional drying towel with extra absorption. Perfect for drying your vehicle after a wash.',
    15.00,
    'droogdoek',
    75,
    3
),
(
    'cleantech-extremedryer-plus',
    'CleanTech | ExtremeDryer+',
    'Onze grootste en meest absorberende droogdoek. Eén doek voor het hele voertuig. XL formaat.',
    'Our largest and most absorbent drying towel. One towel for the entire vehicle. XL size.',
    25.00,
    'droogdoek',
    40,
    4
);

-- -------------------------------------------
-- PRODUCT FOTO'S
-- -------------------------------------------
UPDATE products SET image_url = '/images/ceramixmax.jpg'      WHERE slug = 'cleantech-ceramicmax';
UPDATE products SET image_url = '/images/fibermax.jpg'        WHERE slug = 'cleantech-fibermax';
UPDATE products SET image_url = '/images/dryer+.jpg'          WHERE slug = 'cleantech-dryer-plus';
UPDATE products SET image_url = '/images/extremedryer+.jpg'   WHERE slug = 'cleantech-extremedryer-plus';

-- -------------------------------------------
-- FAQ
-- -------------------------------------------
INSERT INTO faq_items (question_nl, question_en, answer_nl, answer_en, category, sort_order) VALUES
(
    'Wat is het verschil tussen EasyWash en DetailWash?',
    'What is the difference between EasyWash and DetailWash?',
    'De EasyWash is een snelle buitenreiniging (exterieur, velgen, banden) — ideaal voor regelmatig onderhoud. De DetailWash is onze complete premium wasbeurt die ook het interieur grondiger aanpakt en gemiddeld 2 uur duurt.',
    'The EasyWash is a quick exterior clean (bodywork, rims, tyres) — ideal for regular maintenance. The DetailWash is our complete premium wash that also thoroughly cleans the interior and takes about 2 hours on average.',
    'diensten',
    1
),
(
    'Hoe lang duurt een DetailWash?',
    'How long does a DetailWash take?',
    'Gemiddeld duurt een DetailWash zo''n 2 uur, afhankelijk van de staat en het type van het voertuig. We proberen altijd met twee personen te werken om zo efficiënt mogelijk te zijn.',
    'On average, a DetailWash takes about 2 hours, depending on the condition and type of the vehicle. We always try to work with two people for maximum efficiency.',
    'diensten',
    2
),
(
    'Kan ik een Extra dienst apart boeken zonder wasbeurt?',
    'Can I book an Extra service separately without a wash?',
    'Ja, dat kan! Onze Extra''s zoals Motorruimte Reiniging, Leder Behandeling of Dieptereiniging kunnen apart worden geboekt. Voor het beste resultaat raden wij echter aan ze te combineren met een EasyWash of DetailWash.',
    'Yes, you can! Our Extras such as Engine Bay Cleaning, Leather Treatment or Deep Cleaning can be booked separately. However, for the best result, we recommend combining them with an EasyWash or DetailWash.',
    'diensten',
    3
),
(
    'Wat is het werkgebied van ICO?',
    'What is ICO''s service area?',
    'Wij zijn actief in heel Vlaanderen. Onze mobiele Washbus komt naar u toe, thuis of op locatie.',
    'We are active throughout Flanders. Our mobile Washbus comes to you, at home or on location.',
    'algemeen',
    4
),
(
    'Hoe maak ik een afspraak?',
    'How do I make an appointment?',
    'U kunt eenvoudig een afspraak boeken via onze boekingspagina op de website. Kies een datum, tijdslot en dienst, en wij bevestigen uw afspraak.',
    'You can easily book an appointment via our booking page on the website. Choose a date, time slot and service, and we will confirm your appointment.',
    'boekingen',
    5
),
(
    'Moet ik iets voorzien voor de wasbeurt?',
    'Do I need to provide anything for the wash?',
    'Nee, wij brengen alles mee in onze Washbus! Het enige wat wij vragen is toegang tot een wateraansluiting en een stopcontact in de buurt van het voertuig.',
    'No, we bring everything in our Washbus! The only thing we ask for is access to a water connection and a power outlet near the vehicle.',
    'diensten',
    6
),
(
    'Hoe lang duurt een coating?',
    'How long does a coating take?',
    'De duur hangt af van het type coating. Een Basis Coating duurt ongeveer 3 uur, een Premium Coating 5 uur en een Pro Coating een volledige dag. Dit inclusief de lak-voorbereiding.',
    'The duration depends on the type of coating. A Basic Coating takes about 3 hours, a Premium Coating 5 hours and a Pro Coating a full day. This includes the paint preparation.',
    'diensten',
    7
),
(
    'Hoe worden de CleanTech producten geleverd?',
    'How are CleanTech products delivered?',
    'Producten worden via pakketpost verstuurd. Na betaling ontvangt u een bevestigingsmail met trackinginformatie.',
    'Products are shipped via parcel post. After payment, you will receive a confirmation email with tracking information.',
    'webshop',
    8
),
(
    'Wat zijn de prijzen voor bestelwagens?',
    'What are the prices for vans?',
    'Voor bestelwagens rekenen we een apprijs afhankelijk van het formaat. Een standaard bestelwagen (bv. VW Caddy) begint bij €80 voor EasyWash, een grotere bestelwagen (bv. VW Transporter) bij €90 en een XL bestelwagen (bv. VW Crafter) bij €100.',
    'For vans we charge a specific price depending on the size. A standard van (e.g. VW Caddy) starts at €80 for EasyWash, a larger van (e.g. VW Transporter) at €90 and an XL van (e.g. VW Crafter) at €100.',
    'diensten',
    9
);

-- -------------------------------------------
-- SITE INSTELLINGEN
-- -------------------------------------------
INSERT INTO site_settings (key, value) VALUES
('contact', '{"email": "info@ico-detailing.be", "phone": "+32 XXX XX XX XX", "whatsapp": "+32XXXXXXXXX"}'),
('social_media', '{"facebook": "https://facebook.com/teamico", "instagram": "https://instagram.com/teamico"}'),
('working_hours', '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00", "saturday": "10:00-16:00", "sunday": "Gesloten"}'),
('service_area', '{"nl": "Regio Vlaanderen — wij komen naar u toe!", "en": "Flanders region — we come to you!"}'),
('booking_settings', '{"min_days_ahead": 1, "max_days_ahead": 60, "time_slots": ["09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00"]}'),
('shipping', '{"free_shipping_threshold": 50.00, "standard_shipping_cost": 4.95, "shipping_note_nl": "Gratis verzending vanaf €50", "shipping_note_en": "Free shipping from €50"}');

-- -------------------------------------------
-- TESTIMONIALS
-- -------------------------------------------
INSERT INTO testimonials (customer_name, content_nl, content_en, rating, vehicle, is_featured, sort_order) VALUES
(
    'Thomas V.',
    'Ongelofelijk resultaat! Mijn auto zag er beter uit dan toen ik hem kocht. Rico en Nico zijn echte vakmensen.',
    'Incredible result! My car looked better than when I bought it. Rico and Nico are true craftsmen.',
    5,
    'BMW 3 Serie',
    true,
    1
),
(
    'Sarah D.',
    'Top service! Ze kwamen bij mij thuis en binnen 2 uur was mijn auto weer als nieuw. Heel professioneel.',
    'Top service! They came to my home and within 2 hours my car was like new again. Very professional.',
    5,
    'Volkswagen Golf',
    true,
    2
),
(
    'Kevin M.',
    'De Dieptereiniging heeft wonderen gedaan voor mijn interieur. Vlekken die er al maanden zaten zijn volledig weg.',
    'The Deep Cleaning worked wonders for my interior. Stains that had been there for months are completely gone.',
    5,
    'Audi A4',
    true,
    3
),
(
    'Lien B.',
    'Geweldige PPF installatie op mijn nieuwe Tesla. Nette afwerking, vriendelijk team en correcte prijs. Absolute aanrader!',
    'Great PPF installation on my new Tesla. Clean finish, friendly team and fair price. Highly recommended!',
    5,
    'Tesla Model 3',
    true,
    4
);
