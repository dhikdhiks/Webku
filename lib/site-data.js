import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME && process.env.DB_NAME !== 'your_database_name' ? process.env.DB_NAME : 'webku'

let cachedClient = null
let cachedDb = null
let cachedPromise = null

async function getDb() {
  if (cachedDb) return cachedDb
  if (!cachedPromise) {
    cachedPromise = (async () => {
      const client = new MongoClient(MONGO_URL, {
        maxPoolSize: 10,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
      })
      await client.connect()
      cachedClient = client
      cachedDb = client.db(DB_NAME)
      return cachedDb
    })()
  }
  return cachedPromise
}

function cleanDoc({ _id, createdAt, ...rest }) {
  return {
    ...rest,
    ...(createdAt && createdAt instanceof Date ? { createdAt: createdAt.toISOString() } : {}),
  }
}

export async function getSiteData() {
  try {
    const db = await getDb()
    const [packages, services, testimonials, faqs, articles, settingsDoc, stats] = await Promise.all([
      db.collection('packages').find({}).toArray(),
      db.collection('services').find({}).toArray(),
      db.collection('testimonials').find({}).toArray(),
      db.collection('faq').find({}).toArray(),
      db.collection('articles').find({}).sort({ createdAt: -1 }).toArray(),
      db.collection('settings').findOne({ key: 'seeded' }),
      db.collection('settings').findOne({ key: 'stats' }),
    ])
    return {
      packages: packages.map(cleanDoc),
      services: services.map(cleanDoc),
      testimonials: testimonials.map(cleanDoc),
      faqs: faqs.map(cleanDoc),
      articles: articles.map(cleanDoc),
      settings: settingsDoc ? cleanDoc(settingsDoc) : null,
      stats: stats ? cleanDoc(stats) : null,
    }
  } catch (e) {
    console.error('getSiteData failed', e)
    return { packages: [], services: [], testimonials: [], faqs: [], articles: [], settings: null, stats: null }
  }
}