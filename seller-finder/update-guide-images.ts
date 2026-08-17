import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'sellers.db'));

const images: { slug: string; image_url: string }[] = [
  { slug: 'alfa-romeo-159-mk1', image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Alfa_Romeo_159_1.9_JTDm_Distinctive_%28front%29.jpg' },
  { slug: 'alfa-romeo-giulia-tipo-952', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Alfa_952_26.06.19_JM_%281%29_%28cropped%29.jpg' },
  { slug: 'audi-a3-8v', image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Audi_A3_8V_Sportback_2.0_TDI_S_line_%28cropped%29.jpg' },
  { slug: 'audi-a4-b8', image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Audi_A4_B8_Limousine_Ambiente_2.0_TDI_Eissilber.JPG' },
  { slug: 'audi-rs4-b7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Audi_RS4_Avant_grey_Free_Car_Picture_-_Give_Credit_Via_Link_%28cropped%29.jpg' },
  { slug: 'audi-tt-mk2-8j', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/2019_Audi_TT_Sport_40_TFSi_S-A_2.0_Front.jpg' },
  { slug: 'bmw-1-series-e87', image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/BMW_E87_front_20080417.jpg' },
  { slug: 'bmw-3-series-f30', image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/2012_BMW_318d_Sport_Automatic_2.0.jpg' },
  { slug: 'bmw-5-series-f10', image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/BMW_550i_%28F10%29_%E2%80%93_Frontansicht_%282%29%2C_17._Juli_2011%2C_Mettmann.jpg' },
  { slug: 'bmw-m3-e46', image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/BMW_M3_Competition_%28G80%29_IMG_4041.jpg' },
  { slug: 'bmw-m5-e60', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/BMW%2C_Techno_Classica_2018%2C_Essen_%28IMG_8995%29.jpg' },
  { slug: 'ford-fiesta-mk7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/2010_Ford_Fiesta_%28WT%29_LX_5-door_hatchback_%282015-07-16%29_01.jpg' },
  { slug: 'ford-focus-mk3', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ford_Focus_Trend_%28III%29_%E2%80%93_Frontansicht%2C_17._September_2011%2C_Ratingen.jpg' },
  { slug: 'ford-focus-st-mk3', image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/39/2015_Ford_Focus_ST_3%2C_front_8.21.15.jpg' },
  { slug: 'ford-mustang-s550', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/2019_Ford_Mustang_GT_5.0_facelift.jpg' },
  { slug: 'honda-civic-mk8', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/06-08_Honda_Civic_Hybrid.jpg' },
  { slug: 'honda-civic-type-r-fk2', image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/2024_Honda_Civic_Type_R%2C_front_right%2C_06-15-2024.jpg' },
  { slug: 'honda-jazz-mk2', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/2008-2010_Honda_Jazz_%28GE%29_hatchback_%282011-10-25%29.jpg' },
  { slug: 'hyundai-i30-n-pde', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/2017_Hyundai_i30_N_Performance_T-GDi_2.0_Rear.jpg' },
  { slug: 'jaguar-f-type-x152', image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/2017_Jaguar_F-Type_V6_R-Dynamic_Automatic_3.0_Front.jpg' },
  { slug: 'jaguar-xf-x250', image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Jaguar_XF_(2008)_front_left.jpg' },
  { slug: 'kia-stinger-ck', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Kia_Stinger_Facelift_IMG_4468.jpg' },
  { slug: 'land-rover-defender-mk1-90-110', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Land_Rover_Defender.JPG' },
  { slug: 'land-rover-discovery-mk3-l319', image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Land_Rover_Discovery_3_front.jpg' },
  { slug: 'lotus-elise-s2', image_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Lotus_Elise_Club_Racer_%28front_quarter%29.jpg' },
  { slug: 'mini-cooper-s-r56', image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Mini_Hatch_%28J01%29_Ditzingen_Mobil_IMG_9772_%28cropped%29.jpg' },
  { slug: 'mini-cooper-s-f56', image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/MINI_F56_Hatch_Cooper_S_Chili_Red_%283%29.jpg' },
  { slug: 'mazda-3-bl', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mazda3_SKYACTIV-G.jpg' },
  { slug: 'mazda-mx-5-nc', image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/3rd_Mazda_MX-5_--_06-14-2010.jpg' },
  { slug: 'mazda-mx-5-nd', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Mazda_MX-5_%28ND%29_1X7A7471.jpg' },
  { slug: 'mercedes-benz-a-class-w176', image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/2018_Mercedes-Benz_A200_AMG_Line_Premium_Automatic_1.3_Front.jpg' },
  { slug: 'mercedes-benz-c-class-w204', image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/2008_Mercedes-Benz_C300_4MATIC_Sport_Sedan%2C_07-29-2022.jpg' },
  { slug: 'mercedes-benz-e-class-w212', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Mercedes-Benz_E_220_CDI_BlueEFFICIENCY_Elegance_%28W_212%29_%E2%80%93_Frontansicht%2C_23._September_2012%2C_D%C3%BCsseldorf.jpg' },
  { slug: 'mitsubishi-lancer-evolution-x', image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Mitsubishi_Lancer_Evolution_X_%28front%29.jpg' },
  { slug: 'nissan-juke-f15', image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/2013_Nissan_Juke_Tekna_1.6.jpg' },
  { slug: 'nissan-qashqai-j11', image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/NISSAN_QASHQAI_GLORY_%28NISSAN_QASHQAI_%28J11%29%29_%284%29.jpg' },
  { slug: 'peugeot-207-mk1', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Peugeot_207_75_Forever_%28Facelift%29_%E2%80%93_Frontansicht%2C_5._Mai_2012%2C_Ratingen_%28cropped%29.jpg' },
  { slug: 'peugeot-308-mk1-t7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/2008_Peugeot_308_%28T7%29_XS_HDi_5-door_hatchback_%282015-07-03%29_01.jpg' },
  { slug: 'porsche-911-997', image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Porsche_997_Turbo_-_Flickr_-_Alexandre_Pr%C3%A9vot_%288%29.jpg' },
  { slug: 'porsche-boxster-987', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/2007_Porsche_Cayman_S_3.4.jpg' },
  { slug: 'porsche-cayenne-957', image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Porsche_Cayenne_Turbo_front_20080527.jpg' },
  { slug: 'range-rover-sport-l320', image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/2015_Land_Rover_Range_Rover_Sport_HSE_3.0_Front.jpg' },
  { slug: 'renault-clio-mk3', image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Renault_Clio_III_20090527_front.JPG' },
  { slug: 'renault-megane-rs-mk3', image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/2019_Renault_Megane_R.S._300_Trophy_1.8_Front.jpg' },
  { slug: 'seat-leon-cupra-mk2', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/SEAT_Leon_Cupra_Mk2.jpg' },
  { slug: 'skoda-octavia-mk2-1z', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/2007-2008_%C5%A0koda_Octavia_%281Z%29_Elegance_sedan_03.jpg' },
  { slug: 'skoda-octavia-vrs-mk3-5e', image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Skoda_Octavia_Combi_RS_%28III%29_%E2%80%93_Frontansicht%2C_20._Juni_2014%2C_D%C3%BCsseldorf.jpg' },
  { slug: 'subaru-impreza-wrx-sti-gr-gv', image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/3rd_generation_Subaru_Impreza_WRX_STI.jpg' },
  { slug: 'tesla-model-3-mk1', image_url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/2019_Tesla_Model_3_Long_Range_AWD_in_Silver%2C_Front_8.12.19.jpg' },
  { slug: 'toyota-gr-yaris-gxpa16', image_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/2020_Toyota_GR_Yaris_Circuit_Pack_1.6_Front.jpg' },
  { slug: 'toyota-gt86-zn6', image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/2022_Toyota_GR86_Premium_in_Halo%2C_Front_Right%2C_04-10-2022.jpg' },
  { slug: 'toyota-yaris-xp130', image_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/2012_Toyota_Yaris_T3_5-door_%282012-11-30%29_01.jpg' },
  { slug: 'vauxhall-astra-mk6-j', image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/2022_Vauxhall_Astra_GS-Line_1.2_%28Front%29.jpg' },
  { slug: 'vauxhall-corsa-d', image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/2006-2014_Opel_Corsa_D_Front.jpg' },
  { slug: 'vauxhall-insignia-mk1', image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/11/2009_Vauxhall_Insignia_Exclusiv_130_CDTi_2.0.jpg' },
  { slug: 'volkswagen-golf-mk7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/2013_Volkswagen_Golf_SE_BlueMotion_Technology_1.4_Front.jpg' },
  { slug: 'volkswagen-golf-gti-mk7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/2014_Volkswagen_Golf_GTI_%28AU%29_%2814783882753%29.jpg' },
  { slug: 'volkswagen-golf-r-mk7', image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/VW_Golf_VII_R_--_2014_Motorsportmesse_Essen_%28cropped%29.jpg' },
  { slug: 'volkswagen-polo-mk5', image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/VW_Polo_V_20090717_front.JPG' },
];

const stmt = db.prepare(`UPDATE buying_guides SET image_url = ?, updated_at = datetime('now') WHERE slug = ?`);
let updated = 0;
for (const { slug, image_url } of images) {
  const result = stmt.run(image_url, slug);
  if (result.changes) updated++;
}
console.log(`Updated ${updated} guides with images.`);
db.close();
