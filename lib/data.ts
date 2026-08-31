export const SUBJECTS = [
  { id: 'indonesia', name: 'Bahasa Indonesia', type: 'wajib', icon: 'BookOpen' },
  { id: 'matematika', name: 'Matematika', type: 'wajib', icon: 'Target' },
  { id: 'inggris', name: 'Bahasa Inggris', type: 'wajib', icon: 'MessageCircle' },
  { id: 'fisika', name: 'Fisika', type: 'pilihan', icon: 'Target' },
  { id: 'biologi', name: 'Biologi', type: 'pilihan', icon: 'BookOpen' },
  { id: 'kimia', name: 'Kimia', type: 'pilihan', icon: 'BookOpen' },
  { id: 'ekonomi', name: 'Ekonomi', type: 'pilihan', icon: 'TrendingUp' },
  { id: 'sosiologi', name: 'Sosiologi', type: 'pilihan', icon: 'Users' },
  { id: 'geografi', name: 'Geografi', type: 'pilihan', icon: 'Globe' },
  { id: 'sejarah', name: 'Sejarah', type: 'pilihan', icon: 'Clock' },
];

export const TOPICS: Record<string, any[]> = {
  'matematika': [
    {
      id: 'matematika-peluang',
      subjectId: 'matematika',
      title: 'Peluang dan Kombinatorika',
      competency: 'Kombinatorika Dasar',
      summary: 'Kombinasi adalah cara memilih anggota dari himpunan tanpa memperhatikan urutan.',
      content: 'Kombinasi C(n, k) = n! / (k!(n-k)!). Berbeda dengan permutasi, pada kombinasi AB = BA.',
      questions: [
        {
          id: 'q1',
          question: 'Dari 8 siswa akan dipilih 3 orang untuk menjadi pengurus kelas. Banyaknya cara pemilihan adalah...',
          options: ['24', '56', '120', '336'],
          correctIndex: 1,
          explanation: 'Gunakan kombinasi C(8,3) = 8! / (3! * 5!) = (8 * 7 * 6) / (3 * 2 * 1) = 56.'
        },
        {
          id: 'q2',
          question: 'Dalam sebuah kotak terdapat 5 bola merah dan 3 bola putih. Jika diambil 2 bola sekaligus, peluang terambil keduanya bola merah adalah...',
          options: ['5/14', '5/28', '10/28', '15/28'],
          correctIndex: 0,
          explanation: 'Banyak cara mengambil 2 bola dari 8 = C(8,2) = 28. Banyak cara mengambil 2 bola merah dari 5 = C(5,2) = 10. Peluang = 10/28 = 5/14.'
        }
      ]
    },
    {
      id: 'matematika-limit',
      subjectId: 'matematika',
      title: 'Limit Fungsi Aljabar',
      competency: 'Kalkulus Dasar',
      summary: 'Limit fungsi adalah nilai pendekatan suatu fungsi saat variabelnya mendekati nilai tertentu.',
      content: 'Cara menyelesaikan limit fungsi aljabar: subtitusi langsung, faktorisasi, atau kali sekawan.',
      questions: [
        {
          id: 'q3',
          question: 'Nilai dari lim(x->2) (x^2 - 4)/(x - 2) adalah...',
          options: ['0', '2', '4', 'Tak hingga'],
          correctIndex: 2,
          explanation: '(x^2 - 4) dapat difaktorkan menjadi (x - 2)(x + 2). Sehingga (x-2) bisa dicoret, menyisakan lim(x->2) (x + 2) = 2 + 2 = 4.'
        }
      ]
    }
  ],
  'indonesia': [
    {
      id: 'indonesia-ide-pokok',
      subjectId: 'indonesia',
      title: 'Ide Pokok Paragraf',
      competency: 'Membaca Komprehensif',
      summary: 'Ide pokok adalah gagasan utama yang menjiwai sebuah paragraf.',
      content: 'Letak ide pokok bisa di awal (deduktif), akhir (induktif), atau campuran.',
      questions: [
        {
          id: 'q4',
          question: 'Kalimat utama selalu menjadi ide pokok paragraf.',
          options: ['Benar', 'Salah'],
          correctIndex: 0,
          explanation: 'Ide pokok selalu terdapat di dalam kalimat utama.'
        }
      ]
    }
  ],
  'inggris': [
    {
      id: 'inggris-reading',
      subjectId: 'inggris',
      title: 'Reading Comprehension',
      competency: 'Reading',
      summary: 'Understanding main ideas and details in English texts.',
      content: 'Skimming and scanning are essential reading techniques.',
      questions: [
        {
          id: 'q5',
          question: 'What is the main purpose of skimming?',
          options: ['To find specific details', 'To get the general idea', 'To memorize the text', 'To count words'],
          correctIndex: 1,
          explanation: 'Skimming is used to quickly gather the most important information, or "gist".'
        }
      ]
    }
  ]
};

// Generic Diagnostic Test Questions Pool
export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-ind-1',
    subject: 'Bahasa Indonesia',
    subjectId: 'indonesia',
    question: 'Makna kata "inovasi" dalam paragraf tersebut adalah...',
    options: ['Penemuan baru', 'Perubahan total', 'Gagasan usang', 'Karya seni'],
    correctIndex: 0,
    explanation: 'Inovasi berarti penemuan baru yang berbeda dari yang sudah ada.'
  },
  {
    id: 'diag-ind-2',
    subject: 'Bahasa Indonesia',
    subjectId: 'indonesia',
    question: 'Kalimat yang menggunakan ejaan yang tepat adalah...',
    options: ['Budi pergi ke-pasar.', 'Ayah membeli obat di apotek.', 'Dimana kamu tinggal?', 'Ia tidak tahu menahu soal itu.'],
    correctIndex: 1,
    explanation: 'Penulisan baku adalah apotek (bukan apotik). Ke pasar dipisah. Di mana dipisah.'
  },
  {
    id: 'diag-mat-1',
    subject: 'Matematika',
    subjectId: 'matematika',
    question: 'Penyelesaian dari persamaan kuadrat x² - 5x + 6 = 0 adalah...',
    options: ['x=2 atau x=3', 'x=-2 atau x=-3', 'x=1 atau x=6', 'x=-1 atau x=6'],
    correctIndex: 0,
    explanation: 'Faktorisasi: (x-2)(x-3)=0, sehingga x=2 atau x=3.'
  },
  {
    id: 'diag-mat-2',
    subject: 'Matematika',
    subjectId: 'matematika',
    question: 'Suku ke-n dari barisan 2, 5, 8, 11... adalah...',
    options: ['3n - 1', '3n + 1', '2n + 1', '2n - 1'],
    correctIndex: 0,
    explanation: 'Barisan aritmatika dengan a=2, b=3. Un = a + (n-1)b = 2 + (n-1)3 = 3n - 1.'
  },
  {
    id: 'diag-ing-1',
    subject: 'Bahasa Inggris',
    subjectId: 'inggris',
    question: 'Choose the correct sentence:',
    options: ['She don\'t like apples.', 'She doesn\'t likes apples.', 'She doesn\'t like apples.', 'She not like apples.'],
    correctIndex: 2,
    explanation: 'The correct form is subject + doesn\'t + bare infinitive.'
  },
  {
    id: 'diag-ing-2',
    subject: 'Bahasa Inggris',
    subjectId: 'inggris',
    question: 'The antonym of "abundant" is...',
    options: ['Plentiful', 'Scarce', 'Heavy', 'Clear'],
    correctIndex: 1,
    explanation: 'Abundant means existing or available in large quantities; scarce means insufficient for the demand.'
  },
  // Pilihan stand-ins (we'll just use general ones if not exactly mapped for the demo)
  {
    id: 'diag-pil-1',
    subject: 'Mata Pelajaran Pilihan 1',
    subjectId: 'pilihan_1',
    question: 'Soal pemahaman konsep dasar (Pilihan 1). Jika A berhubungan dengan B, dan B berhubungan dengan C, maka...',
    options: ['A = C', 'A berhubungan dengan C', 'C = B', 'Tidak ada hubungan'],
    correctIndex: 1,
    explanation: 'Prinsip transitivitas dasar.'
  },
  {
    id: 'diag-pil-2',
    subject: 'Mata Pelajaran Pilihan 1',
    subjectId: 'pilihan_1',
    question: 'Analisis masalah terkait fenomena X menunjukkan...',
    options: ['Sebab dan akibat terisolasi', 'Hubungan kausalitas', 'Faktor tunggal', 'Acak'],
    correctIndex: 1,
    explanation: 'Setiap fenomena dalam ilmu terapan biasanya menunjukkan kausalitas.'
  },
  {
    id: 'diag-pil-3',
    subject: 'Mata Pelajaran Pilihan 2',
    subjectId: 'pilihan_2',
    question: 'Konsep utama dalam studi ini berfokus pada...',
    options: ['Dinamika sistem', 'Pola statis', 'Observasi pasif', 'Data historis saja'],
    correctIndex: 0,
    explanation: 'Analisis mendalam membutuhkan pemahaman dinamika sistem.'
  },
  {
    id: 'diag-pil-4',
    subject: 'Mata Pelajaran Pilihan 2',
    subjectId: 'pilihan_2',
    question: 'Aplikasi teori ini dalam kehidupan nyata paling sering ditemui pada...',
    options: ['Industri primer', 'Teknologi komunikasi', 'Sistem transportasi', 'Semua jawaban benar'],
    correctIndex: 3,
    explanation: 'Teori ini bersifat universal dan aplikatif.'
  }
];

export const TRYOUTS = [
  {
    id: 'to-1',
    title: 'Tryout Internal #1',
    description: 'Simulasi lengkap mata pelajaran wajib dan pilihan.',
    durationMinutes: 15,
    questions: DIAGNOSTIC_QUESTIONS // Reuse same questions for the demo tryout
  }
];
