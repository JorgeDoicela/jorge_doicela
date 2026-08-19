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

export function seedCorpus(dbPath: string = 'bible.sqlite') {
  const startTime = Date.now();
  console.log(`[CorpusSeeder] Conectando a la base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

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
