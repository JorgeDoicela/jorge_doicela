import * as fs from 'fs';
import * as path from 'path';
import Database from 'better-sqlite3';

interface VerseItem {
  verse: number;
  text: string;
}

interface ChapterItem {
  chapter: number;
  verses: VerseItem[];
}

interface BookCorpus {
  book: string;
  bookAbbreviation: string;
  translation: string;
  translationAbbreviation: string;
  language?: string;
  chapters: ChapterItem[];
}

interface SeedLexiconEntry {
  strongCode: string;
  language: string;
  lemma: string;
  transliteration: string;
  ipa?: string;
  partOfSpeech: string;
  shortDefinition: string;
  extendedDefinition?: string;
}

interface SeedVerseToken {
  wordOrder: number;
  surfaceText: string;
  consonantsOnly?: string;
  transliteration: string;
  strongCode?: string;
  morphologyCode: string;
  gloss: string;
}

interface SeedVerseTokensGroup {
  chapter: number;
  verseNumber: number;
  tokens: SeedVerseToken[];
}

interface SeedHistoricalPlace {
  id: string;
  name: string;
  originalName?: unknown;
  coordinates: unknown;
  category: string;
  era?: unknown;
  modernName?: string;
  country?: string;
  elevationMeters?: number;
  description: string;
  biblicalReferences?: unknown;
  archaeologicalNotes?: unknown;
  language?: string;
}

interface SeedTimelineEvent {
  id: string;
  name: string;
  type: string;
  originalName?: unknown;
  startYearBC: number;
  endYearBC: number;
  kingdom?: string;
  evaluation?: string;
  dynastyOrOrigin?: string;
  contemporaryEntities?: unknown;
  biblicalReferences?: unknown;
  keyEvents?: unknown;
  details?: string;
  language?: string;
}

interface SeedArchaeologyArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  region: string;
  regionLabel: string;
  publishDate: string;
  institutionOrAuthor: string;
  readTimeMinutes: number;
  summary: string;
  contentMarkdown: string;
  biblicalReferences?: unknown;
  epigraphy?: unknown;
  museumOrLocation?: string;
  keyArtifact?: string;
  tags?: unknown;
  language?: string;
}

export const CANONICAL_BOOKS = [
  // Antiguo Testamento (39 libros)
  { id: 1, name: 'Génesis', abbreviation: 'GEN', testament: 'OT' },
  { id: 2, name: 'Éxodo', abbreviation: 'EXO', testament: 'OT' },
  { id: 3, name: 'Levítico', abbreviation: 'LEV', testament: 'OT' },
  { id: 4, name: 'Números', abbreviation: 'NUM', testament: 'OT' },
  { id: 5, name: 'Deuteronomio', abbreviation: 'DEU', testament: 'OT' },
  { id: 6, name: 'Josué', abbreviation: 'JOS', testament: 'OT' },
  { id: 7, name: 'Jueces', abbreviation: 'JUE', testament: 'OT' },
  { id: 8, name: 'Rut', abbreviation: 'RUT', testament: 'OT' },
  { id: 9, name: '1 Samuel', abbreviation: '1SA', testament: 'OT' },
  { id: 10, name: '2 Samuel', abbreviation: '2SA', testament: 'OT' },
  { id: 11, name: '1 Reyes', abbreviation: '1RE', testament: 'OT' },
  { id: 12, name: '2 Reyes', abbreviation: '2RE', testament: 'OT' },
  { id: 13, name: '1 Crónicas', abbreviation: '1CR', testament: 'OT' },
  { id: 14, name: '2 Crónicas', abbreviation: '2CR', testament: 'OT' },
  { id: 15, name: 'Esdras', abbreviation: 'ESD', testament: 'OT' },
  { id: 16, name: 'Nehemías', abbreviation: 'NEH', testament: 'OT' },
  { id: 17, name: 'Ester', abbreviation: 'EST', testament: 'OT' },
  { id: 18, name: 'Job', abbreviation: 'JOB', testament: 'OT' },
  { id: 19, name: 'Salmos', abbreviation: 'SAL', testament: 'OT' },
  { id: 20, name: 'Proverbios', abbreviation: 'PRO', testament: 'OT' },
  { id: 21, name: 'Eclesiastés', abbreviation: 'ECL', testament: 'OT' },
  { id: 22, name: 'Cantares', abbreviation: 'CAN', testament: 'OT' },
  { id: 23, name: 'Isaías', abbreviation: 'ISA', testament: 'OT' },
  { id: 24, name: 'Jeremías', abbreviation: 'JER', testament: 'OT' },
  { id: 25, name: 'Lamentaciones', abbreviation: 'LAM', testament: 'OT' },
  { id: 26, name: 'Ezequiel', abbreviation: 'EZE', testament: 'OT' },
  { id: 27, name: 'Daniel', abbreviation: 'DAN', testament: 'OT' },
  { id: 28, name: 'Oseas', abbreviation: 'OSE', testament: 'OT' },
  { id: 29, name: 'Joel', abbreviation: 'JOE', testament: 'OT' },
  { id: 30, name: 'Amós', abbreviation: 'AMO', testament: 'OT' },
  { id: 31, name: 'Abdías', abbreviation: 'ABD', testament: 'OT' },
  { id: 32, name: 'Jonás', abbreviation: 'JON', testament: 'OT' },
  { id: 33, name: 'Miqueas', abbreviation: 'MIQ', testament: 'OT' },
  { id: 34, name: 'Nahúm', abbreviation: 'NAH', testament: 'OT' },
  { id: 35, name: 'Habacuc', abbreviation: 'HAB', testament: 'OT' },
  { id: 36, name: 'Sofonías', abbreviation: 'SOF', testament: 'OT' },
  { id: 37, name: 'Hageo', abbreviation: 'HAG', testament: 'OT' },
  { id: 38, name: 'Zacarías', abbreviation: 'ZAC', testament: 'OT' },
  { id: 39, name: 'Malaquías', abbreviation: 'MAL', testament: 'OT' },
  // Nuevo Testamento (27 libros)
  { id: 40, name: 'Mateo', abbreviation: 'MAT', testament: 'NT' },
  { id: 41, name: 'Marcos', abbreviation: 'MAR', testament: 'NT' },
  { id: 42, name: 'Lucas', abbreviation: 'LUC', testament: 'NT' },
  { id: 43, name: 'Juan', abbreviation: 'JUA', testament: 'NT' },
  { id: 44, name: 'Hechos', abbreviation: 'HEC', testament: 'NT' },
  { id: 45, name: 'Romanos', abbreviation: 'ROM', testament: 'NT' },
  { id: 46, name: '1 Corintios', abbreviation: '1CO', testament: 'NT' },
  { id: 47, name: '2 Corintios', abbreviation: '2CO', testament: 'NT' },
  { id: 48, name: 'Gálatas', abbreviation: 'GAL', testament: 'NT' },
  { id: 49, name: 'Efesios', abbreviation: 'EFE', testament: 'NT' },
  { id: 50, name: 'Filipenses', abbreviation: 'FIL', testament: 'NT' },
  { id: 51, name: 'Colosenses', abbreviation: 'COL', testament: 'NT' },
  { id: 52, name: '1 Tesalonicenses', abbreviation: '1TE', testament: 'NT' },
  { id: 53, name: '2 Tesalonicenses', abbreviation: '2TE', testament: 'NT' },
  { id: 54, name: '1 Timoteo', abbreviation: '1TI', testament: 'NT' },
  { id: 55, name: '2 Timoteo', abbreviation: '2TI', testament: 'NT' },
  { id: 56, name: 'Tito', abbreviation: 'TIT', testament: 'NT' },
  { id: 57, name: 'Filemón', abbreviation: 'FLM', testament: 'NT' },
  { id: 58, name: 'Hebreos', abbreviation: 'HEB', testament: 'NT' },
  { id: 59, name: 'Santiago', abbreviation: 'STG', testament: 'NT' },
  { id: 60, name: '1 Pedro', abbreviation: '1PE', testament: 'NT' },
  { id: 61, name: '2 Pedro', abbreviation: '2PE', testament: 'NT' },
  { id: 62, name: '1 Juan', abbreviation: '1JU', testament: 'NT' },
  { id: 63, name: '2 Juan', abbreviation: '2JU', testament: 'NT' },
  { id: 64, name: '3 Juan', abbreviation: '3JU', testament: 'NT' },
  { id: 65, name: 'Judas', abbreviation: 'JUD', testament: 'NT' },
  { id: 66, name: 'Apocalipsis', abbreviation: 'APO', testament: 'NT' },
];

export function seedCorpus(dbPath: string = 'bible.sqlite') {
  const startTime = Date.now();
  console.log(
    `[CorpusSeeder] 🚀 Recreando base de datos desde cero: ${dbPath}...`,
  );

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  // 1. Reset limpio total de las 8 tablas del corpus
  console.log('[CorpusSeeder] Purgando tablas anteriores (Reset Limpio)...');
  db.exec(`
    DROP TABLE IF EXISTS morphology_tokens;
    DROP TABLE IF EXISTS lexicon_entries;
    DROP TABLE IF EXISTS verses;
    DROP TABLE IF EXISTS translations;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS historical_places;
    DROP TABLE IF EXISTS timeline_events;
    DROP TABLE IF EXISTS archaeology_articles;

    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR NOT NULL,
      abbreviation VARCHAR NOT NULL UNIQUE,
      testament VARCHAR NOT NULL
    );

    CREATE TABLE translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR NOT NULL,
      abbreviation VARCHAR NOT NULL UNIQUE,
      language VARCHAR NOT NULL
    );

    CREATE TABLE verses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter INTEGER NOT NULL,
      verseNumber INTEGER NOT NULL,
      text TEXT NOT NULL,
      bookId INTEGER NOT NULL,
      translationId INTEGER NOT NULL,
      FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (translationId) REFERENCES translations(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_verse_unique ON verses(translationId, bookId, chapter, verseNumber);
    CREATE INDEX IF NOT EXISTS IDX_verse_lookup ON verses(bookId, translationId, chapter);

    CREATE TABLE lexicon_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      strongCode VARCHAR(10) NOT NULL UNIQUE,
      language VARCHAR(20) NOT NULL,
      lemma VARCHAR(100) NOT NULL,
      transliteration VARCHAR(100) NOT NULL,
      ipa VARCHAR(50),
      partOfSpeech VARCHAR(100) NOT NULL,
      shortDefinition TEXT NOT NULL,
      extendedDefinition TEXT
    );
    CREATE INDEX IF NOT EXISTS IDX_lexicon_strong ON lexicon_entries(strongCode);

    CREATE TABLE morphology_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      verseId INTEGER NOT NULL,
      wordOrder INTEGER NOT NULL,
      surfaceText VARCHAR(100) NOT NULL,
      consonantsOnly VARCHAR(100),
      transliteration VARCHAR(100) NOT NULL,
      strongCode VARCHAR(10),
      morphologyCode VARCHAR(50) NOT NULL,
      gloss VARCHAR(150) NOT NULL,
      FOREIGN KEY (verseId) REFERENCES verses(id) ON DELETE CASCADE
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_morph_token_unique ON morphology_tokens(verseId, wordOrder);
    CREATE INDEX IF NOT EXISTS IDX_morph_strong ON morphology_tokens(strongCode);

    CREATE TABLE historical_places (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      originalName TEXT,
      coordinates TEXT NOT NULL,
      category VARCHAR(32) NOT NULL,
      era TEXT,
      modernName VARCHAR(128),
      country VARCHAR(64),
      elevationMeters INTEGER,
      description TEXT NOT NULL,
      biblicalReferences TEXT,
      archaeologicalNotes TEXT,
      language VARCHAR(10) NOT NULL DEFAULT 'es'
    );
    CREATE INDEX IF NOT EXISTS IDX_places_category ON historical_places(category);

    CREATE TABLE timeline_events (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(128) NOT NULL,
      type VARCHAR(32) NOT NULL,
      originalName TEXT,
      startYearBC INTEGER NOT NULL,
      endYearBC INTEGER NOT NULL,
      kingdom VARCHAR(32),
      evaluation VARCHAR(16),
      dynastyOrOrigin VARCHAR(128),
      contemporaryEntities TEXT,
      biblicalReferences TEXT,
      keyEvents TEXT,
      details TEXT,
      language VARCHAR(10) NOT NULL DEFAULT 'es'
    );
    CREATE INDEX IF NOT EXISTS IDX_timeline_type ON timeline_events(type);
    CREATE INDEX IF NOT EXISTS IDX_timeline_start ON timeline_events(startYearBC);
    CREATE INDEX IF NOT EXISTS IDX_timeline_end ON timeline_events(endYearBC);

    CREATE TABLE archaeology_articles (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(256) NOT NULL,
      slug VARCHAR(256) NOT NULL,
      category VARCHAR(64) NOT NULL,
      region VARCHAR(64) NOT NULL,
      regionLabel VARCHAR(128) NOT NULL,
      publishDate VARCHAR(32) NOT NULL,
      institutionOrAuthor VARCHAR(256) NOT NULL,
      readTimeMinutes INTEGER NOT NULL,
      summary TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      biblicalReferences TEXT,
      epigraphy TEXT,
      museumOrLocation VARCHAR(256),
      keyArtifact VARCHAR(256),
      tags TEXT,
      language VARCHAR(10) NOT NULL DEFAULT 'es'
    );
    CREATE INDEX IF NOT EXISTS IDX_articles_cat ON archaeology_articles(category);
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_articles_slug_lang ON archaeology_articles(slug, language);
  `);

  // Sembrar los 66 libros canónicos de forma segura
  console.log('[CorpusSeeder] Sembrando catálogo de 66 libros canónicos...');
  const seedBooksTx = db.transaction(() => {
    const insertStmt = db.prepare(
      'INSERT INTO books (id, name, abbreviation, testament) VALUES (?, ?, ?, ?)',
    );

    for (const b of CANONICAL_BOOKS) {
      insertStmt.run(b.id, b.name, b.abbreviation, b.testament);
    }
  });
  seedBooksTx();

  // Sembrar las 5 traducciones oficiales autorizadas
  console.log(
    '[CorpusSeeder] Sembrando catálogo de 5 traducciones oficiales...',
  );
  const OFFICIAL_TRANSLATIONS = [
    {
      id: 1,
      name: 'Texto Hebreo Masorético',
      abbreviation: 'BHS',
      language: 'he',
    },
    {
      id: 2,
      name: 'Texto Crítico Griego',
      abbreviation: 'NA28',
      language: 'el',
    },
    {
      id: 3,
      name: 'Nueva Biblia de las Américas',
      abbreviation: 'NBLA',
      language: 'es',
    },
    {
      id: 4,
      name: 'Nueva Traducción Viviente',
      abbreviation: 'NTV',
      language: 'es',
    },
    {
      id: 5,
      name: 'New International Version',
      abbreviation: 'NIV',
      language: 'en',
    },
    {
      id: 6,
      name: 'Reina-Valera 1909',
      abbreviation: 'RV1909',
      language: 'es',
    },
  ];

  const seedTranslationsTx = db.transaction(() => {
    const insertStmt = db.prepare(
      'INSERT INTO translations (id, name, abbreviation, language) VALUES (?, ?, ?, ?)',
    );
    for (const t of OFFICIAL_TRANSLATIONS) {
      insertStmt.run(t.id, t.name, t.abbreviation, t.language);
    }
  });
  seedTranslationsTx();

  const corpusDir = path.resolve(__dirname, '../corpus');
  if (!fs.existsSync(corpusDir)) {
    console.warn(
      `[CorpusSeeder] Directorio de corpus no encontrado en: ${corpusDir}`,
    );
    return;
  }

  const translations = fs.readdirSync(corpusDir);
  let totalVersesInserted = 0;

  for (const transFolder of translations) {
    if (transFolder === 'historical' || transFolder === 'morphology') continue;
    const transPath = path.join(corpusDir, transFolder);
    if (!fs.statSync(transPath).isDirectory()) continue;

    const files = fs.readdirSync(transPath).filter((f) => f.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(transPath, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as BookCorpus;

      console.log(
        `[CorpusSeeder] Procesando ${data.book} (${data.bookAbbreviation}) en ${data.translationAbbreviation}...`,
      );

      // 1. Obtener o crear Book
      const bookRow = db
        .prepare('SELECT id FROM books WHERE abbreviation = ?')
        .get(data.bookAbbreviation) as { id: number } | undefined;

      let bookId: number;
      if (bookRow) {
        bookId = bookRow.id;
      } else {
        const isNT = ['MAT', 'MRK', 'LUK', 'JHN', 'ACT', 'ROM'].includes(
          data.bookAbbreviation,
        );
        const info = db
          .prepare(
            'INSERT INTO books (name, abbreviation, testament) VALUES (?, ?, ?)',
          )
          .run(data.book, data.bookAbbreviation, isNT ? 'NT' : 'OT');
        bookId = Number(info.lastInsertRowid);
      }

      // 2. Obtener o crear Translation
      const transRow = db
        .prepare('SELECT id FROM translations WHERE abbreviation = ?')
        .get(data.translationAbbreviation) as { id: number } | undefined;

      let translationId: number;
      if (transRow) {
        translationId = transRow.id;
      } else {
        const lang = data.language || 'es';
        const info = db
          .prepare(
            'INSERT INTO translations (name, abbreviation, language) VALUES (?, ?, ?)',
          )
          .run(data.translation, data.translationAbbreviation, lang);
        translationId = Number(info.lastInsertRowid);
      }

      // 3. Inserción Transaccional por Lotes (Batch Chunks)
      const insertStmt = db.prepare(`
        INSERT OR REPLACE INTO verses (bookId, translationId, chapter, verseNumber, text)
        VALUES (?, ?, ?, ?, ?)
      `);

      const insertBatch = db.transaction((chapters: ChapterItem[]) => {
        let count = 0;
        for (const ch of chapters) {
          for (const v of ch.verses) {
            insertStmt.run(bookId, translationId, ch.chapter, v.verse, v.text);
            count++;
          }
        }
        return count;
      });

      const count = insertBatch(data.chapters);
      totalVersesInserted += count;
      console.log(`[CorpusSeeder] -> ${count} versículos procesados en lote.`);
    }
  }

  // 4. Sembrado Transaccional de Morfología y Léxicos Strong
  const morphDir = path.join(corpusDir, 'morphology');
  if (fs.existsSync(morphDir)) {
    const morphFiles = fs.readdirSync(morphDir);

    // A. Lexicon Entries
    const lexiconFiles = morphFiles.filter((f) => f.endsWith('_lexicon.json'));
    const insertLexicon = db.prepare(`
      INSERT OR REPLACE INTO lexicon_entries (strongCode, language, lemma, transliteration, ipa, partOfSpeech, shortDefinition, extendedDefinition)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let totalLexiconCount = 0;
    for (const lf of lexiconFiles) {
      const entries = JSON.parse(
        fs.readFileSync(path.join(morphDir, lf), 'utf8'),
      ) as SeedLexiconEntry[];
      const txLexicon = db.transaction((items: SeedLexiconEntry[]) => {
        for (const e of items) {
          insertLexicon.run(
            e.strongCode,
            e.language,
            e.lemma,
            e.transliteration,
            e.ipa || null,
            e.partOfSpeech,
            e.shortDefinition,
            e.extendedDefinition || null,
          );
        }
      });
      txLexicon(entries);
      totalLexiconCount += entries.length;
    }
    console.log(
      `[MorphologySeeder] -> ${totalLexiconCount} entradas léxicas Strong indexadas.`,
    );

    // B. Morphology Tokens
    const tokenFiles = morphFiles.filter((f) => f.endsWith('_tokens.json'));
    const findVerseStmt = db.prepare(`
      SELECT v.id FROM verses v
      JOIN books b ON v.bookId = b.id
      JOIN translations t ON v.translationId = t.id
      WHERE b.abbreviation = ? AND (t.abbreviation = 'BHS' OR t.abbreviation = 'NA28') AND v.chapter = ? AND v.verseNumber = ?
    `);

    const insertTokenStmt = db.prepare(`
      INSERT INTO morphology_tokens (verseId, wordOrder, surfaceText, consonantsOnly, transliteration, strongCode, morphologyCode, gloss)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let totalTokensCount = 0;
    for (const tf of tokenFiles) {
      const bookAbbr = tf.startsWith('genesis')
        ? 'GEN'
        : tf.startsWith('matthew')
          ? 'MAT'
          : 'GEN';
      const verseTokensList = JSON.parse(
        fs.readFileSync(path.join(morphDir, tf), 'utf8'),
      ) as SeedVerseTokensGroup[];

      const txTokens = db.transaction((list: SeedVerseTokensGroup[]) => {
        let count = 0;
        for (const item of list) {
          const row = findVerseStmt.get(
            bookAbbr,
            item.chapter,
            item.verseNumber,
          ) as { id: number } | undefined;
          const verseId = row ? row.id : 1;
          for (const tok of item.tokens) {
            insertTokenStmt.run(
              verseId,
              tok.wordOrder,
              tok.surfaceText,
              tok.consonantsOnly || null,
              tok.transliteration,
              tok.strongCode || null,
              tok.morphologyCode,
              tok.gloss,
            );
            count++;
          }
        }
        return count;
      });

      totalTokensCount += txTokens(verseTokensList);
    }
    console.log(
      `[MorphologySeeder] -> ${totalTokensCount} tokens morfológicos interlineales indexados.`,
    );
  }

  // 5. Sembrado Transaccional de Contexto Histórico
  const historicalDir = path.join(corpusDir, 'historical');
  if (fs.existsSync(historicalDir)) {
    // A. Historical Places (Atlas)
    const placesPath = path.join(historicalDir, 'atlas_locations.json');
    if (fs.existsSync(placesPath)) {
      const places = JSON.parse(
        fs.readFileSync(placesPath, 'utf8'),
      ) as SeedHistoricalPlace[];
      const insertPlace = db.prepare(`
        INSERT INTO historical_places (id, name, originalName, coordinates, category, era, modernName, country, elevationMeters, description, biblicalReferences, archaeologicalNotes, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const txPlaces = db.transaction((items: SeedHistoricalPlace[]) => {
        for (const p of items) {
          insertPlace.run(
            p.id,
            p.name,
            JSON.stringify(p.originalName || null),
            JSON.stringify(p.coordinates),
            p.category,
            JSON.stringify(p.era || []),
            p.modernName || null,
            p.country || null,
            p.elevationMeters || null,
            p.description,
            JSON.stringify(p.biblicalReferences || []),
            JSON.stringify(p.archaeologicalNotes || null),
            p.language || 'es',
          );
        }
      });
      txPlaces(places);
      console.log(
        `[HistoricalSeeder] -> ${places.length} ubicaciones geográficas indexadas.`,
      );
    }

    // B. Timeline Events
    const timelinePath = path.join(historicalDir, 'timeline_events.json');
    if (fs.existsSync(timelinePath)) {
      const events = JSON.parse(
        fs.readFileSync(timelinePath, 'utf8'),
      ) as SeedTimelineEvent[];
      const insertEvent = db.prepare(`
        INSERT INTO timeline_events (id, name, type, originalName, startYearBC, endYearBC, kingdom, evaluation, dynastyOrOrigin, contemporaryEntities, biblicalReferences, keyEvents, details, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const txEvents = db.transaction((items: SeedTimelineEvent[]) => {
        for (const e of items) {
          insertEvent.run(
            e.id,
            e.name,
            e.type,
            JSON.stringify(e.originalName || null),
            e.startYearBC,
            e.endYearBC,
            e.kingdom || null,
            e.evaluation || null,
            e.dynastyOrOrigin || null,
            JSON.stringify(e.contemporaryEntities || []),
            JSON.stringify(e.biblicalReferences || []),
            JSON.stringify(e.keyEvents || []),
            e.details || null,
            e.language || 'es',
          );
        }
      });
      txEvents(events);
      console.log(
        `[HistoricalSeeder] -> ${events.length} entidades cronológicas indexadas.`,
      );
    }

    // C. Archaeology Articles
    const articlesPath = path.join(historicalDir, 'archaeology_articles.json');
    if (fs.existsSync(articlesPath)) {
      const articles = JSON.parse(
        fs.readFileSync(articlesPath, 'utf8'),
      ) as SeedArchaeologyArticle[];
      const insertArticle = db.prepare(`
        INSERT INTO archaeology_articles (id, title, slug, category, region, regionLabel, publishDate, institutionOrAuthor, readTimeMinutes, summary, contentMarkdown, biblicalReferences, epigraphy, museumOrLocation, keyArtifact, tags, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const txArticles = db.transaction((items: SeedArchaeologyArticle[]) => {
        for (const a of items) {
          insertArticle.run(
            a.id,
            a.title,
            a.slug,
            a.category,
            a.region,
            a.regionLabel,
            a.publishDate,
            a.institutionOrAuthor,
            a.readTimeMinutes,
            a.summary,
            a.contentMarkdown,
            JSON.stringify(a.biblicalReferences || []),
            JSON.stringify(a.epigraphy || null),
            a.museumOrLocation || null,
            a.keyArtifact || null,
            JSON.stringify(a.tags || []),
            a.language || 'es',
          );
        }
      });
      txArticles(articles);
      console.log(
        `[HistoricalSeeder] -> ${articles.length} artículos arqueológicos indexados.`,
      );
    }
  }

  const elapsed = Date.now() - startTime;
  const memoryUsageMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
    2,
  );

  console.log(
    `\n[CorpusSeeder] Completado con éxito: ${totalVersesInserted} versículos indexados en ${elapsed} ms. Consumo de RAM: ${memoryUsageMB} MB.`,
  );
}

// Ejecución directa si se invoca por CLI
if (require.main === module) {
  const targetDb = process.env.DATABASE_BIBLE_PATH || 'bible.sqlite';
  seedCorpus(targetDb);
}
