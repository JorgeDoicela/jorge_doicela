import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiBibleService {
  private readonly logger = new Logger(ApiBibleService.name);
  private readonly apiBibleKey = process.env.API_BIBLE_KEY;
  private readonly youVersionKey = process.env.YVP_APP_KEY;
  private readonly apiBibleBaseUrl = 'https://api.scripture.api.bible/v1';
  private readonly youVersionBaseUrl = 'https://api.youversion.com/v1';

  // Mapa de identificadores oficiales en API.Bible (American Bible Society)
  private readonly apiBibleIdMap: Record<string, string> = {
    NBLA: 'ce11b813f9a27e20-01', // Nueva Biblia de las Américas (The Lockman Foundation)
    NTV: '826f63861180e056-01', // Nueva Traducción Viviente (Tyndale)
    RV1960: '592420522e16049f-01', // Reina Valera 1909 / 1960 (Sociedades Bíblicas Unidas)
    RV1909: '592420522e16049f-01', // Reina Valera 1909
    NIV: '78a9f6124f344018-01', // New International Version 2011 (Bíblica)
    DHH: '592420522e16049f-02', // Dios Habla Hoy (SBU)
  };

  // Mapa de identificadores oficiales en YouVersion Platform (Life.Church / Partners)
  private readonly youVersionIdMap: Record<string, number> = {
    NBLA: 103, // Nueva Biblia de las Américas (The Lockman Foundation)
    LBLA: 89, // La Biblia de las Américas (The Lockman Foundation)
    NVI: 128, // Nueva Versión Internacional (Biblica)
    NASB1995: 100, // New American Standard Bible 1995 (Lockman)
    NASB2020: 2692, // New American Standard Bible 2020 (Lockman)
    AMP: 1588, // Amplified Bible (Lockman)
  };

  // Mapeo canónico de abreviaciones en español a códigos estándar USFM de 3 letras
  private readonly usfmBookMap: Record<string, string> = {
    GEN: 'GEN',
    EXO: 'EXO',
    LEV: 'LEV',
    NUM: 'NUM',
    DEU: 'DEU',
    JOS: 'JOS',
    JUE: 'JDG',
    RUT: 'RUT',
    '1SA': '1SA',
    '2SA': '2SA',
    '1RE': '1KI',
    '2RE': '2KI',
    '1CR': '1CH',
    '2CR': '2CH',
    ESD: 'EZR',
    NEH: 'NEH',
    EST: 'EST',
    JOB: 'JOB',
    SAL: 'PSA',
    PRO: 'PRO',
    ECL: 'ECC',
    CAN: 'SNG',
    ISA: 'ISA',
    JER: 'JER',
    LAM: 'LAM',
    EZE: 'EZK',
    DAN: 'DAN',
    OSE: 'HOS',
    JOE: 'JOL',
    AMO: 'AMO',
    ABD: 'OBA',
    JON: 'JON',
    MIQ: 'MIC',
    NAH: 'NAM',
    HAB: 'HAB',
    SOF: 'ZEP',
    HAG: 'HAG',
    ZAC: 'ZEC',
    MAL: 'MAL',
    MAT: 'MAT',
    MAR: 'MRK',
    LUC: 'LUK',
    JUA: 'JHN',
    HEC: 'ACT',
    ROM: 'ROM',
    '1CO': '1CO',
    '2CO': '2CO',
    GAL: 'GAL',
    EFE: 'EPH',
    FIL: 'PHP',
    COL: 'COL',
    '1TE': '1TH',
    '2TE': '2TH',
    '1TI': '1TI',
    '2TI': '2TI',
    TIT: 'TIT',
    FLM: 'PHM',
    HEB: 'HEB',
    STG: 'JAS',
    '1PE': '1PE',
    '2PE': '2PE',
    '1JU': '1JN',
    '2JU': '2JN',
    '3JU': '3JN',
    JUD: 'JUD',
    APO: 'REV',
  };

  isConfigured(): boolean {
    return (
      (!!this.apiBibleKey && this.apiBibleKey.trim().length > 0) ||
      (!!this.youVersionKey && this.youVersionKey.trim().length > 0)
    );
  }

  getUsfmCode(bookAbbr: string): string {
    const upper = bookAbbr.toUpperCase();
    return this.usfmBookMap[upper] || upper;
  }

  /**
   * Obtiene un capítulo bíblico íntegro con soporte multi-proveedor y fallback transparente
   */
  async fetchChapterVerses(
    translationAbbr: string,
    bookAbbr: string,
    chapter: number,
  ): Promise<Array<{ verseNumber: number; text: string }> | null> {
    const upperTrans = translationAbbr.toUpperCase();
    const usfmCode = this.getUsfmCode(bookAbbr);

    // 1. Intentar YouVersion si la versión y la clave están disponibles
    if (this.youVersionKey && this.youVersionIdMap[upperTrans]) {
      const youVersionId = this.youVersionIdMap[upperTrans];
      const verses = await this.fetchFromYouVersion(
        youVersionId,
        usfmCode,
        chapter,
      );
      if (verses && verses.length > 0) {
        return verses;
      }
    }

    // 2. Intentar API.Bible si está disponible
    if (this.apiBibleKey && this.apiBibleIdMap[upperTrans]) {
      const apiBibleId = this.apiBibleIdMap[upperTrans];
      const verses = await this.fetchFromApiBible(
        apiBibleId,
        usfmCode,
        chapter,
      );
      if (verses && verses.length > 0) {
        return verses;
      }
    }

    return null;
  }

  /**
   * Consulta oficial a YouVersion Platform REST API
   */
  private async fetchFromYouVersion(
    bibleId: number,
    usfmCode: string,
    chapter: number,
  ): Promise<Array<{ verseNumber: number; text: string }> | null> {
    const passageId = `${usfmCode}.${chapter}`;
    const url = `${this.youVersionBaseUrl}/bibles/${bibleId}/passages/${passageId}?format=html`;

    try {
      const response = await fetch(url, {
        headers: {
          'x-yvp-app-key': this.youVersionKey as string,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `YouVersion respondió ${response.status} para ${passageId} (Bible ${bibleId})`,
        );
        return null;
      }

      const json = (await response.json()) as { content?: string };
      const content = json.content || '';
      if (!content) return null;

      // Parseo de spans de versículos en HTML de YouVersion
      const regex =
        /<span\s+class="yv-v"\s+v="(\d+)"><\/span>(?:<span\s+class="yv-vlbl">\d+<\/span>)?([\s\S]*?)(?=(?:<span\s+class="yv-v"\s+v="\d+"><\/span>|$))/g;
      let match: RegExpExecArray | null;
      const results: Array<{ verseNumber: number; text: string }> = [];

      while ((match = regex.exec(content)) !== null) {
        const vNum = parseInt(match[1], 10);
        const rawText = match[2]
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        if (vNum && rawText) {
          results.push({ verseNumber: vNum, text: rawText });
        }
      }

      return results.length > 0 ? results : null;
    } catch (err: unknown) {
      this.logger.error(
        `Error al conectar con YouVersion para ${passageId}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return null;
    }
  }

  /**
   * Consulta oficial a API.Bible REST API
   */
  private async fetchFromApiBible(
    bibleId: string,
    usfmCode: string,
    chapter: number,
  ): Promise<Array<{ verseNumber: number; text: string }> | null> {
    const chapterId = `${usfmCode}.${chapter}`;
    const url = `${this.apiBibleBaseUrl}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-verse-spans=true`;

    try {
      const response = await fetch(url, {
        headers: {
          'api-key': this.apiBibleKey as string,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `API.Bible respondió ${response.status} para ${chapterId}`,
        );
        return null;
      }

      const json = (await response.json()) as { data?: { content?: string } };
      const content = json.data?.content || '';
      if (!content) return null;

      // Parser regex para extraer [1] versículo [2] versículo...
      const regex = /\[(\d+)\]\s*([^[]+)/g;
      let match: RegExpExecArray | null;
      const results: Array<{ verseNumber: number; text: string }> = [];

      while ((match = regex.exec(content)) !== null) {
        const vNum = parseInt(match[1], 10);
        const vText = match[2].trim().replace(/\s+/g, ' ');
        if (vNum && vText) {
          results.push({ verseNumber: vNum, text: vText });
        }
      }

      return results.length > 0 ? results : null;
    } catch (err: unknown) {
      this.logger.error(
        `Error al conectar con API.Bible para ${chapterId}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
      return null;
    }
  }
}
