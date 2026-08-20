import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiBibleService {
  private readonly logger = new Logger(ApiBibleService.name);
  private readonly apiKey = process.env.API_BIBLE_KEY;
  private readonly baseUrl = 'https://api.scripture.api.bible/v1';

  // Mapa de identificadores oficiales autorizados en API.Bible
  private readonly bibleIdMap: Record<string, string> = {
    NBLA: 'ce11b813f9a27e20-01', // Nueva Biblia de las Américas (The Lockman Foundation)
    NTV: '826f63861180e056-01', // Nueva Traducción Viviente (Tyndale)
    RV1960: '592420522e16049f-01', // Reina Valera 1909 / 1960 (Sociedades Bíblicas Unidas)
    RV1909: '592420522e16049f-01', // Reina Valera 1909
    NIV: '65eec8e0b60e656b-01', // New International Version (Bíblica)
    DHH: '592420522e16049f-02', // Dios Habla Hoy (SBU)
  };

  // Mapeo canónico de abreviaciones en español a códigos estándar USFM de 3 letras de API.Bible
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
    return !!this.apiKey && this.apiKey.trim().length > 0;
  }

  getBibleId(translationAbbr: string): string | null {
    return this.bibleIdMap[translationAbbr.toUpperCase()] || null;
  }

  getUsfmCode(bookAbbr: string): string {
    const upper = bookAbbr.toUpperCase();
    return this.usfmBookMap[upper] || upper;
  }

  /**
   * Obtiene un capítulo bíblico íntegro en una sola llamada de red de alta velocidad
   */
  async fetchChapterVerses(
    translationAbbr: string,
    bookAbbr: string,
    chapter: number,
  ): Promise<Array<{ verseNumber: number; text: string }> | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const bibleId = this.getBibleId(translationAbbr);
    if (!bibleId) {
      return null;
    }

    const usfmCode = this.getUsfmCode(bookAbbr);
    const chapterId = `${usfmCode}.${chapter}`;
    const url = `${this.baseUrl}/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-verse-spans=true`;

    try {
      const response = await fetch(url, {
        headers: {
          'api-key': this.apiKey as string,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `API.Bible respondió con código ${response.status} para ${chapterId}`,
        );
        return null;
      }

      const json = (await response.json()) as { data?: { content?: string } };
      const content = json.data?.content || '';

      if (!content) {
        return null;
      }

      // Parser de alta velocidad con regex para extraer [1] versículo [2] versículo...
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
