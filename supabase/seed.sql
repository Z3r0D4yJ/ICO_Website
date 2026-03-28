-- =============================================
-- ICO Website — Seed Data (Comprehensive)
-- =============================================
-- Versie: Alles-in-één seed — alle diensten, producten, FAQ, instellingen, testimonials
-- Runnen op een verse database na schema.sql
-- =============================================

-- -------------------------------------------
-- DIENSTEN — volledig ICO-catalogus
-- -------------------------------------------

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
-- Coating wordt uitgevoerd in de professionele garage van ICO in Hamme

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'leather-coating',
    'Leather Coating',
    'Leather Coating',
    'Beschermende Carbon Collective keramische coating voor leren zetels. Carbon Collective staat bekend als een van de meest premium coatingmerken ter wereld. Voorkomt uitdroging, scheuren en verkleuring. Maakt leder gemakkelijk schoon te houden en houdt het soepel en mooi. Uitgevoerd in onze garage in Hamme.',
    'Protective Carbon Collective ceramic coating for leather seats. Carbon Collective is known as one of the most premium coating brands in the world. Prevents drying out, cracking and discolouration. Makes leather easy to clean and keeps it supple and beautiful. Applied in our garage in Hamme.',
    'Carbon Collective keramische bescherming voor leren zetels. Garage Hamme.',
    'Carbon Collective ceramic protection for leather seats. Garage Hamme.',
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
    'Carbon Collective Window Coating — professionele hydrofobe coating voor alle ramen. Maakt ramen 100% waterafstotend: water parelt onmiddellijk van het glas. Betere zichtbaarheid bij regen, minder poetsen en langdurige bescherming dankzij Carbon Collective technologie. Uitgevoerd in onze garage in Hamme.',
    'Carbon Collective Window Coating — professional hydrophobic coating for all windows. Makes windows 100% water-repellent: water immediately beads off the glass. Better visibility in rain, less cleaning and long-lasting protection thanks to Carbon Collective technology. Applied in our garage in Hamme.',
    'Carbon Collective Window Coating — 100% waterafstotend. Garage Hamme.',
    'Carbon Collective Window Coating — 100% water-repellent. Garage Hamme.',
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
    'Carbon Collective Platinum Ceramic Coating voor de velgen. Beschermt intensief tegen remstofresten, hitte en wegvuil. Velgen blijven aanzienlijk langer proper en zijn in een handomdraai te reinigen. Langdurige diepe glans en topbescherming. Uitgevoerd in onze garage in Hamme.',
    'Carbon Collective Platinum Ceramic Coating for the rims. Provides intensive protection against brake dust, heat and road dirt. Rims stay noticeably cleaner longer and are quick to clean. Long-lasting deep shine and top protection. Applied in our garage in Hamme.',
    'Carbon Collective Platinum Ceramic Coating voor duurzame velgenbescherming. Garage Hamme.',
    'Carbon Collective Platinum Ceramic Coating for long-lasting rim protection. Garage Hamme.',
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
    '2-laags Carbon Collective Diamond Infused Ceramic Coating van de volledige carrosserie. Carbon Collective is een van de meest gerenommeerde coatingmerken ter wereld — hun Diamond Infused formule biedt superieure lakbescherming met hydrofobisch effect, UV-bescherming en een ongeëvenaarde diepe glans. Inclusief grondige lakvoorbereiding. Uitgevoerd in onze professionele garage in Hamme voor optimale omstandigheden.',
    '2-layer Carbon Collective Diamond Infused Ceramic Coating of the full bodywork. Carbon Collective is one of the most renowned coating brands in the world — their Diamond Infused formula provides superior paint protection with hydrophobic effect, UV protection and an unmatched deep gloss. Including thorough paint preparation. Applied in our professional garage in Hamme for optimal conditions.',
    '2-laags Carbon Collective Diamond Infused Ceramic Coating — volledige carrosserie. Garage Hamme.',
    '2-layer Carbon Collective Diamond Infused Ceramic Coating — full bodywork. Garage Hamme.',
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
    '3de laag Carbon Collective Self Healing Diamond Infused Ceramic Coating als upgrade op de Carrosserie Coating. De zelfherstellende formule van Carbon Collective biedt extra bescherming tegen fijne krassen en steenslag — uw lak herstelt zichzelf bij lichte beschadigingen. Uitgevoerd in onze garage in Hamme.',
    '3rd layer Carbon Collective Self Healing Diamond Infused Ceramic Coating as an upgrade to the Carrosserie Coating. Carbon Collective''s self-healing formula provides extra protection against fine scratches and stone chips — your paint repairs itself after light damage. Applied in our garage in Hamme.',
    'Carbon Collective Self Healing 3de coatinglaag — upgrade op Carrosserie Coating. Garage Hamme.',
    'Carbon Collective Self Healing 3rd coating layer — upgrade on Carrosserie Coating. Garage Hamme.',
    300.00,
    120,
    'ShieldCheck',
    'coating',
    24
);

-- ===== CATEGORIE: PPF (Paint Protection Film) =====
-- PPF wordt uitsluitend aangebracht in de garage in Hamme

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'ppf-anti-fingerprint',
    'Anti-Fingerprint PPF',
    'Anti-Fingerprint PPF',
    'PPF folie speciaal voor multimediaschermpanelen en touchscreens in het voertuig. Beschermt tegen vingerafdrukken, krassen en slijtage. Nauwelijks zichtbaar. Geplaatst in onze garage in Hamme voor een perfect resultaat.',
    'PPF film specially for multimedia screen panels and touchscreens in the vehicle. Protects against fingerprints, scratches and wear. Barely visible. Applied in our garage in Hamme for a perfect result.',
    'PPF folie voor multimediaschermpanelen. Garage Hamme.',
    'PPF film for multimedia screen panels. Garage Hamme.',
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
    'Bescherming van de voorruit met PPF. Beschermt tegen steenslag, insecten en fijne krassen. Verbetert de zichtbaarheid niet maar beschermt de ruit langdurig. Geplaatst in onze garage in Hamme.',
    'Protection of the windshield with PPF. Protects against stone chips, insects and fine scratches. Does not improve visibility but protects the glass long-term. Applied in our garage in Hamme.',
    'PPF folie voor de voorruit. Garage Hamme.',
    'PPF film for the windshield. Garage Hamme.',
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
    'Volledige frontbescherming: motorkap, zijvleugels en voorbumper volledig ingepakt met PPF. Beschermt de meest kwetsbare zones van uw wagen tegen steenslag, insecten en dagelijkse schade. Geplaatst in onze garage in Hamme.',
    'Full front protection: bonnet, side wings and front bumper fully wrapped in PPF. Protects the most vulnerable zones of your car against stone chips, insects and daily damage. Applied in our garage in Hamme.',
    'Motorkap, zijvleugels en voorbumper in PPF. Garage Hamme.',
    'Bonnet, side wings and front bumper in PPF. Garage Hamme.',
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
    'Volledige voertuigbescherming met PPF. Elk paneel van uw wagen wordt ingepakt met hoogwaardige zelfherstellende PPF folie. De ultieme bescherming voor uw investering. Geplaatst in onze garage in Hamme.',
    'Full vehicle protection with PPF. Every panel of your car is wrapped in high-quality self-healing PPF film. The ultimate protection for your investment. Applied in our garage in Hamme.',
    'Volledige wagen beschermd in PPF — de ultieme bescherming. Garage Hamme.',
    'Full vehicle wrapped in PPF — the ultimate protection. Garage Hamme.',
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
    'Bescherming van de koplampen met PPF. Koplampen zijn bijzonder vatbaar voor steenslag en UV-schade. PPF houdt ze helder en in perfecte staat. Geplaatst in onze garage in Hamme.',
    'Protection of the headlights with PPF. Headlights are particularly susceptible to stone chips and UV damage. PPF keeps them clear and in perfect condition. Applied in our garage in Hamme.',
    'PPF folie voor de koplampen. Garage Hamme.',
    'PPF film for the headlights. Garage Hamme.',
    200.00,
    120,
    'Eye',
    'ppf',
    34
);

-- ===== CATEGORIE: HOME CARE =====
-- Home Care (woninginterieurs, keuken wrapping, etc.) — vereist ook bezoek aan de garage

INSERT INTO services (slug, title_nl, title_en, description_nl, description_en, short_description_nl, short_description_en, price_from, duration_minutes, icon, service_category, sort_order) VALUES
(
    'homecare',
    'Home Care',
    'Home Care',
    'Naast voertuigen behandelen Rico & Nico ook woninginterieurs. Denk aan PPF-bescherming voor meubeloppervlakken, keukenfronten of het volledig wrappen van een keuken. Een unieke dienst die wij als één van de weinigen in België aanbieden. Neem contact op voor een offerte op maat.',
    'Aside from vehicles, Rico & Nico also treat home interiors. Think PPF protection for furniture surfaces, kitchen fronts or fully wrapping a kitchen. A unique service offered by very few in Belgium. Contact us for a tailored quote.',
    'PPF en coating voor woninginterieurs — keukens, meubels en meer.',
    'PPF and coating for home interiors — kitchens, furniture and more.',
    NULL,
    NULL,
    'Home',
    'homecare',
    40
);

-- -------------------------------------------
-- SERVICE FOTO'S
-- -------------------------------------------
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'easywash';
UPDATE services SET image_url = '/images/nico-exterieur-behandeling.jpg'   WHERE slug = 'detailwash';
UPDATE services SET image_url = '/images/audi-rs-zetels-detail.jpg'        WHERE slug = 'extra-dieptereiniging';
UPDATE services SET image_url = '/images/bmw-interieur-detail.jpg'         WHERE slug = 'extra-steam-wash';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg'  WHERE slug = 'extra-car-polish';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg'  WHERE slug = 'extra-hyper-screen-wash';
UPDATE services SET image_url = '/images/rico-interieur-reiniging.jpg'     WHERE slug = 'extra-airco-clean';
UPDATE services SET image_url = '/images/audi-rs-zetels-detail.jpg'        WHERE slug = 'leather-coating';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg'  WHERE slug = 'window-coating';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'wheels-coating';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg'  WHERE slug = 'carrosserie-coating';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'extra-carrosserie-coating';
UPDATE services SET image_url = '/images/bmw-interieur-detail.jpg'         WHERE slug = 'ppf-anti-fingerprint';
UPDATE services SET image_url = '/images/porsche-taycan-zonsondergang.jpg'  WHERE slug = 'ppf-windshield';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'ppf-full-front';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'ppf-full-package';
UPDATE services SET image_url = '/images/ferrari-testarossa-ico.jpg'       WHERE slug = 'ppf-headlight';
UPDATE services SET image_url = '/images/opel-gt-washbus.jpg'              WHERE slug = 'homecare';

-- -------------------------------------------
-- PRODUCTEN (CleanTech lijn)
-- -------------------------------------------
TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (slug, name, description_nl, description_en, price, category, stock_quantity, sort_order) VALUES
(
    'cleantech-ceramicmax',
    'CleanTech | CeramicMax',
    'Professionele keramische coating spray voor langdurige bescherming en diepe glans. Dezelfde producten die Rico & Nico dagelijks gebruiken bij hun klanten.',
    'Professional ceramic coating spray for long-lasting protection and deep shine. The same products Rico & Nico use daily with their clients.',
    7.50,
    'coating',
    50,
    1
),
(
    'cleantech-fibermax',
    'CleanTech | FiberMax',
    'Hoogwaardige microvezel doek voor streepvrij drogen en polijsten. Ideaal voor dagelijks onderhoud van uw voertuig.',
    'Premium microfiber cloth for streak-free drying and polishing. Ideal for daily maintenance of your vehicle.',
    5.00,
    'droogdoek',
    100,
    2
),
(
    'cleantech-dryer-plus',
    'CleanTech | Dryer+',
    'Professionele droogdoek met extra absorptievermogen. Perfect voor het drogen van uw voertuig na een wasbeurt — snel en streepvrij.',
    'Professional drying towel with extra absorption. Perfect for drying your vehicle after a wash — fast and streak-free.',
    15.00,
    'droogdoek',
    75,
    3
),
(
    'cleantech-extremedryer-plus',
    'CleanTech | ExtremeDryer+',
    'Onze grootste en meest absorberende droogdoek. Eén doek voor het volledige voertuig. XL formaat voor maximale efficiëntie.',
    'Our largest and most absorbent drying towel. One towel for the entire vehicle. XL size for maximum efficiency.',
    25.00,
    'droogdoek',
    40,
    4
);

-- -------------------------------------------
-- PRODUCT FOTO'S
-- -------------------------------------------
UPDATE products SET image_url = '/images/ceramixmax.jpg'       WHERE slug = 'cleantech-ceramicmax';
UPDATE products SET image_url = '/images/fibermax.jpg'         WHERE slug = 'cleantech-fibermax';
UPDATE products SET image_url = '/images/dryer+.jpg'           WHERE slug = 'cleantech-dryer-plus';
UPDATE products SET image_url = '/images/extremedryer+.jpg'    WHERE slug = 'cleantech-extremedryer-plus';

-- -------------------------------------------
-- FAQ (bijgewerkt met echte ICO content)
-- -------------------------------------------
TRUNCATE faq_items RESTART IDENTITY CASCADE;

INSERT INTO faq_items (question_nl, question_en, answer_nl, answer_en, category, sort_order) VALUES
(
    'Hoe lang duurt een DetailWash?',
    'How long does a DetailWash take?',
    'Gemiddeld nemen onze behandelingen zo''n 2 uur in beslag, afhankelijk van de staat van het voertuig. We proberen steeds met twee personen te werken om de tijd zo efficiënt mogelijk te houden — twee paar handen = sneller klaar én dubbel zo grondig.',
    'On average our treatments take about 2 hours, depending on the condition of the vehicle. We always try to work with two people to keep the time as efficient as possible — two pairs of hands = finished faster and twice as thorough.',
    'diensten',
    1
),
(
    'Wat is inbegrepen bij een Dieptereiniging?',
    'What is included in a Deep Cleaning?',
    'Bij een dieptereiniging reinigen we de zetels en tapijten grondig met een professionele extractiemachine om vuil, vlekken en geuren te verwijderen. Voor het beste resultaat raden we aan dit te combineren met een DetailWash — een proper interieur verdient ook een proper exterieur.',
    'In a deep cleaning we thoroughly clean the seats and carpets with a professional extraction machine to remove dirt, stains and odours. For the best result we recommend combining this with a DetailWash — a clean interior deserves a clean exterior.',
    'diensten',
    2
),
(
    'Wat is Paint Protection Film (PPF)?',
    'What is Paint Protection Film (PPF)?',
    'PPF is een transparante, zelfherstellende folie die op de lak van uw voertuig wordt aangebracht. Het beschermt tegen steenslag, krassen, insecten en weersinvloeden. PPF wordt uitsluitend aangebracht in onze garage in Hamme, waar de ideale omstandigheden (licht, stofvrij, temperatuur) een perfect resultaat garanderen. Ook voor woninginterieurs zoals keukens.',
    'PPF is a transparent, self-healing film applied to the paint of your vehicle. It protects against stone chips, scratches, insects and weather influences. PPF is exclusively applied in our garage in Hamme, where ideal conditions (lighting, dust-free, temperature) guarantee a perfect result. Also available for home interiors such as kitchens.',
    'diensten',
    3
),
(
    'Welke voertuigen behandelen jullie?',
    'What vehicles do you treat?',
    'Wij behandelen auto''s (sedan, hatchback, coupé), SUV''s, bestelwagens én motoren. Voor elk voertuigtype passen we de aanpak en prijszetting aan. Twijfelt u? Stuur ons een berichtje en we helpen u vrijblijvend verder.',
    'We treat cars (sedan, hatchback, coupé), SUVs, vans and motorcycles. We adapt our approach and pricing to each vehicle type. Not sure? Send us a message and we will help you without obligation.',
    'diensten',
    4
),
(
    'Wat is Home Care bij ICO?',
    'What is Home Care at ICO?',
    'Naast voertuigen behandelen wij ook woninginterieurs. Denk aan PPF-bescherming voor meubeloppervlakken of het volledig wrappen van een keuken. Een unieke dienst die wij als één van de weinigen in België aanbieden.',
    'In addition to vehicles we also treat home interiors. Think PPF protection for furniture surfaces or fully wrapping a kitchen. A unique service offered by very few in Belgium.',
    'diensten',
    5
),
(
    'Hoe maak ik een afspraak bij ICO?',
    'How do I make an appointment at ICO?',
    'Neem contact op via het contactformulier op onze website of via onze socials (Instagram, Facebook of WhatsApp). Vermeld zeker het type voertuig en de gewenste dienst, dan helpen Rico & Nico je zo snel mogelijk verder.',
    'Contact us via the contact form on our website or via our socials (Instagram, Facebook or WhatsApp). Be sure to mention the vehicle type and desired service, and Rico & Nico will help you as quickly as possible.',
    'boekingen',
    6
),
(
    'Komen jullie bij mij thuis of moet ik naar jullie komen?',
    'Do you come to my home or do I come to you?',
    'Dat hangt af van de dienst. Voor wasbeurten (DetailWash, Dieptereiniging) komt de Washbus naar u toe — thuis, op het werk of elke locatie in Vlaanderen. Voor keramische coating en PPF moet u naar onze garage in Hamme komen. Daar hebben we professionele verlichting en een gecontroleerde omgeving voor een vlekkeloos resultaat.',
    'That depends on the service. For washes (DetailWash, Deep Cleaning) the Washbus comes to you — at home, at work or any location in Flanders. For ceramic coating and PPF you come to our garage in Hamme. There we have professional lighting and a controlled environment for a flawless result.',
    'boekingen',
    7
),
(
    'Kan ik mijn afspraak annuleren of verplaatsen?',
    'Can I cancel or reschedule my appointment?',
    'Annuleren of verplaatsen kan kosteloos tot 24 uur voor de afspraak. Neem contact met ons op via WhatsApp of e-mail om uw afspraak te wijzigen.',
    'Cancelling or rescheduling is free of charge up to 24 hours before the appointment. Contact us via WhatsApp or email to change your appointment.',
    'boekingen',
    8
),
(
    'Wat is het werkgebied van ICO?',
    'What is ICO''s service area?',
    'Wij zijn actief in heel Vlaanderen — 6 dagen op 7. Of u nu in Antwerpen, Gent, Leuven of Brugge woont, wij komen naar u toe. Twijfelt u of uw locatie in ons werkgebied ligt? Stuur ons gerust een berichtje.',
    'We are active throughout Flanders — 6 days a week. Whether you live in Antwerp, Ghent, Leuven or Bruges, we come to you. Not sure whether your location is in our service area? Feel free to send us a message.',
    'boekingen',
    9
),
(
    'Welke betaalmethoden accepteren jullie in de webshop?',
    'Which payment methods do you accept in the webshop?',
    'In de webshop kunt u betalen via Bancontact, Visa, Mastercard en andere veelgebruikte betaalmethoden via ons veilig betalingssysteem. Alle prijzen zijn inclusief 21% BTW — geen verrassingen achteraf.',
    'In the webshop you can pay via Bancontact, Visa, Mastercard and other common payment methods via our secure payment system. All prices include 21% VAT — no surprises afterwards.',
    'webshop',
    10
),
(
    'Wat zijn de CleanTech producten?',
    'What are the CleanTech products?',
    'CleanTech is onze eigen professionele productlijn — dezelfde producten die Rico & Nico dagelijks gebruiken bij hun klanten. Van keramische coating tot microvezel droogdoeken: beschikbaar via onze webshop.',
    'CleanTech is our own professional product line — the same products Rico & Nico use daily with their clients. From ceramic coating to microfiber drying towels: available via our webshop.',
    'webshop',
    11
),
(
    'Hoe kan ik contact opnemen met ICO?',
    'How can I contact ICO?',
    'Bereik ons via het contactformulier op onze website, of direct via Instagram, Facebook of WhatsApp. WhatsApp is ons snelste kanaal — Rico & Nico reageren doorgaans snel tijdens werkdagen.',
    'Reach us via the contact form on our website, or directly via Instagram, Facebook or WhatsApp. WhatsApp is our fastest channel — Rico & Nico typically respond quickly on working days.',
    'algemeen',
    12
),
(
    'Zijn alle prijzen inclusief BTW?',
    'Are all prices inclusive of VAT?',
    'Ja! Alle weergegeven prijzen op onze website zijn inclusief 21% BTW. Geen verborgen kosten, geen verrassingen achteraf — wat u ziet is wat u betaalt.',
    'Yes! All prices shown on our website include 21% VAT. No hidden costs, no surprises afterwards — what you see is what you pay.',
    'algemeen',
    13
);

-- -------------------------------------------
-- SITE INSTELLINGEN
-- -------------------------------------------
INSERT INTO site_settings (key, value) VALUES
(
    'contact',
    '{"email": "info@ico-detailing.be", "phone": "+32 XXX XX XX XX", "whatsapp": "+32XXXXXXXXX"}'
),
(
    'social_media',
    '{"facebook": "https://facebook.com/teamico", "instagram": "https://instagram.com/teamico"}'
),
(
    'working_hours',
    '{"monday": "09:00-17:00", "tuesday": "09:00-17:00", "wednesday": "09:00-17:00", "thursday": "09:00-17:00", "friday": "09:00-17:00", "saturday": "10:00-16:00", "sunday": "Gesloten"}'
),
(
    'service_area',
    '{"nl": "Heel Vlaanderen — wasbeurten aan huis, coating & PPF in onze garage in Hamme.", "en": "All of Flanders — mobile washes at your location, coating & PPF in our garage in Hamme."}'
),
(
    'booking_settings',
    '{"min_days_ahead": 1, "max_days_ahead": 60, "time_slots": ["09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00"]}'
),
(
    'garage_address',
    '{"nl": "Hamme, 9220 Oost-Vlaanderen", "en": "Hamme, 9220 East Flanders", "maps_url": ""}'
),
(
    'shipping',
    '{"free_shipping_threshold": 50.00, "standard_shipping_cost": 4.95, "shipping_note_nl": "Gratis verzending vanaf €50", "shipping_note_en": "Free shipping from €50"}'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- -------------------------------------------
-- TESTIMONIALS
-- -------------------------------------------
TRUNCATE testimonials RESTART IDENTITY CASCADE;

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

-- -------------------------------------------
-- TABLE-LEVEL GRANTS (idempotent — veilig om opnieuw te runnen)
-- -------------------------------------------

GRANT SELECT ON services        TO anon;
GRANT SELECT ON products        TO anon;
GRANT SELECT ON blog_posts      TO anon;
GRANT SELECT ON projects        TO anon;
GRANT SELECT ON faq_items       TO anon;
GRANT SELECT ON site_settings   TO anon;
GRANT SELECT ON testimonials    TO anon;
GRANT SELECT ON availability    TO anon;
GRANT SELECT ON booking_updates TO anon;

GRANT INSERT ON bookings        TO anon;
GRANT INSERT ON orders          TO anon;
GRANT INSERT ON quote_requests  TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON admin_users     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON services        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON booking_updates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON availability    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON products        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_posts      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON faq_items       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON site_settings   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON testimonials    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON quote_requests  TO authenticated;

-- -------------------------------------------
-- ADMIN GEBRUIKERS (handmatig aanmaken via Supabase dashboard)
-- -------------------------------------------
-- Maak de twee admin accounts aan via de Supabase Auth UI of CLI:
--
--   Rico:  rico@ico-detailing.be   (wachtwoord instellen via dashboard)
--   Nico:  nico@ico-detailing.be   (wachtwoord instellen via dashboard)
--
-- Voeg hun UUID's daarna toe aan de admin_users whitelist:
--
--   INSERT INTO admin_users (user_id) VALUES
--     ('<UUID van Rico uit auth.users>'),
--     ('<UUID van Nico uit auth.users>');
--
-- =============================================
