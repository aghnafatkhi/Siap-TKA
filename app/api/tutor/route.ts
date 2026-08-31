import { GoogleGenAI, Type, Schema, ThinkingLevel } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const tutorResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    status: {
      type: Type.STRING,
      description: 'Status respons (benar, salah, pertanyaan)',
    },
    petunjuk: {
      type: Type.STRING,
      description: 'Petunjuk singkat untuk mengarahkan siswa sebelum memberikan jawaban lengkap.',
    },
    penjelasan: {
      type: Type.STRING,
      description: 'Penjelasan langkah demi langkah atau konsep yang mudah dipahami siswa SMA.',
    },
    letak_kesalahan: {
      type: Type.STRING,
      description: 'Jelaskan letak kesalahan siswa jika ada. Kosongkan jika benar.',
    },
    jawaban_benar: {
      type: Type.STRING,
      description: 'Jawaban yang benar dari soal yang sedang dibahas.',
    },
    rekomendasi_berikutnya: {
      type: Type.STRING,
      description: 'Saran tindakan selanjutnya untuk siswa.',
    },
    referensi_materi: {
      type: Type.STRING,
      description: 'Bagian materi yang menjadi acuan jawaban.',
    },
    tingkat_keyakinan: {
      type: Type.INTEGER,
      description: 'Tingkat keyakinan jawaban (0-100).',
    }
  },
  required: ['status', 'petunjuk', 'penjelasan', 'letak_kesalahan', 'jawaban_benar', 'rekomendasi_berikutnya', 'referensi_materi', 'tingkat_keyakinan'],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject,
      topic,
      content,
      question,
      studentAnswer,
      correctAnswer,
      isCorrect,
      context
    } = body;

    const systemInstruction = `Kamu adalah tutor AI untuk aplikasi "Siap TKA", membantu siswa SMA kelas XII persiapan tes.
Aturan:
- Gunakan bahasa Indonesia yang natural, mudah dipahami siswa SMA. Hindari gaya bahasa chatbot seperti "Tentu! Dengan senang hati", "Mari kita selami".
- Jika konteks adalah latihan soal: Utamakan memberikan petunjuk (hint) sebelum memberikan jawaban. Jelaskan letak kesalahan, bukan hanya menyatakan salah. Tampilkan langkah pengerjaan secara runtut (khususnya hitungan).
- PENTING: Kamu TIDAK BOLEH mengganti atau menyalahkan Kunci Jawaban dari bank soal yang sudah tervalidasi. Selalu setuju dengan Kunci Jawaban yang diberikan di prompt. Tugasmu hanya menjelaskan mengapa Kunci Jawaban tersebut benar.
- Jangan membuat fakta, rumus, atau ketentuan yang tidak ada.
- Jangan memberi pujian berlebihan.
- Keluarkan respons dalam bentuk JSON yang sesuai dengan schema yang ditentukan.`;

    const promptText = `
Konteks Pembelajaran:
Mata Pelajaran: ${subject}
Topik: ${topic}
Materi Acuan: ${content}
Konteks Saat Ini: ${context}
${question ? "Soal: " + question : ""}
${studentAnswer ? "Jawaban Siswa: " + studentAnswer : ""}
${correctAnswer ? "Kunci Jawaban: " + correctAnswer : ""}
${isCorrect !== undefined ? "Status: " + (isCorrect ? "Benar" : "Salah") : ""}

Tolong berikan penjelasan dan bimbingan yang tepat untuk siswa ini.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview', // high thinking, complex instruction
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: tutorResponseSchema,
        temperature: 0.2, // low temp for factual accuracy
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    if (!response.text) {
      throw new Error("No response from model");
    }

    const jsonResponse = JSON.parse(response.text);
    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Tutor API Error:', error);
    return NextResponse.json(
      { error: 'Maaf, tutor sedang mengalami kendala. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
