import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const DATA_SOURCES = {
  ourairports: [
    { name: 'airports.csv', url: 'https://davidmegginson.github.io/ourairports-data/airports.csv' },
    { name: 'airport-frequencies.csv', url: 'https://davidmegginson.github.io/ourairports-data/airport-frequencies.csv' },
    { name: 'runways.csv', url: 'https://davidmegginson.github.io/ourairports-data/runways.csv' },
    { name: 'countries.csv', url: 'https://davidmegginson.github.io/ourairports-data/countries.csv' },
    { name: 'regions.csv', url: 'https://davidmegginson.github.io/ourairports-data/regions.csv' }
  ],
  openflights: [
    { name: 'airports.dat', url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat' },
    { name: 'airlines.dat', url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat' },
    { name: 'routes.dat', url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat' },
    { name: 'planes.dat', url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/planes.dat' },
    { name: 'countries.dat', url: 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/countries.dat' }
  ]
};

async function downloadFile(url, destPath) {
  console.log(`⏳ İndiriliyor: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP Hata! Statu: ${response.status} URL: ${url}`);
  
  const fileStream = fs.createWriteStream(destPath);
  await pipeline(Readable.fromWeb(response.body), fileStream);
  console.log(`✅ Tamamlandı: ${destPath}`);
}

async function run() {
  console.log('🚀 Açık kaynak Ulaşım & Lokasyon Veri İndirme İşlemi Başladı...\n');

  for (const source of DATA_SOURCES.ourairports) {
    const dest = path.join(process.cwd(), 'data/raw/ourairports', source.name);
    await downloadFile(source.url, dest);
  }

  for (const source of DATA_SOURCES.openflights) {
    const dest = path.join(process.cwd(), 'data/raw/openflights', source.name);
    await downloadFile(source.url, dest);
  }

  console.log('\n🎉 Havalimanı ve Uçuş Hatları Verileri Başarıyla İndirildi.');
}

run().catch(console.error);