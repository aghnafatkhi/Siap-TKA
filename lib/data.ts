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

export interface Question {
  id: string;
  assessmentType: 'diagnostic' | 'practice' | 'tryout';
  subjectId: string;
  subjectName: string;
  competencyId: string;
  competencyName: string;
  subcompetency: string;
  topic: string;
  stimulusType: 'text' | 'image' | 'table' | 'none';
  stimulus?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceTitle: string;
  sourceUrl: string;
  validationStatus: 'verified' | 'unverified';
  contentType: 'text';
  reviewedAt: string;
}

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'diag-ind-1',
    assessmentType: 'diagnostic',
    subjectId: 'indonesia',
    subjectName: 'Bahasa Indonesia',
    competencyId: 'ind-membaca',
    competencyName: 'Membaca Komprehensif',
    subcompetency: 'Menentukan Makna Kata',
    topic: 'Makna Kata',
    stimulusType: 'text',
    stimulus: 'Di era digital saat ini, berbagai perusahaan teknologi terus berlomba menciptakan inovasi untuk mempermudah kehidupan manusia. Mulai dari kecerdasan buatan hingga perangkat pintar yang terhubung ke internet.',
    question: 'Makna kata "inovasi" dalam paragraf tersebut adalah...',
    options: ['Penemuan baru', 'Perubahan total', 'Gagasan usang', 'Karya seni'],
    correctAnswer: 'Penemuan baru',
    correctIndex: 0,
    explanation: 'Dalam konteks teks tersebut, inovasi merujuk pada penemuan atau gagasan baru yang diciptakan oleh perusahaan teknologi.',
    difficulty: 'easy',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'diag-mat-1',
    assessmentType: 'diagnostic',
    subjectId: 'matematika',
    subjectName: 'Matematika',
    competencyId: 'mat-aljabar',
    competencyName: 'Aljabar',
    subcompetency: 'Persamaan Kuadrat',
    topic: 'Faktorisasi Persamaan Kuadrat',
    stimulusType: 'none',
    question: 'Penyelesaian dari persamaan kuadrat x² - 5x + 6 = 0 adalah...',
    options: ['x=2 atau x=3', 'x=-2 atau x=-3', 'x=1 atau x=6', 'x=-1 atau x=6'],
    correctAnswer: 'x=2 atau x=3',
    correctIndex: 0,
    explanation: 'Faktorisasi: (x-2)(x-3)=0, sehingga nilai x yang memenuhi adalah x=2 atau x=3.',
    difficulty: 'medium',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'diag-ing-1',
    assessmentType: 'diagnostic',
    subjectId: 'inggris',
    subjectName: 'Bahasa Inggris',
    competencyId: 'ing-grammar',
    competencyName: 'Grammar and Structure',
    subcompetency: 'Simple Present Tense',
    topic: 'Subject-Verb Agreement',
    stimulusType: 'none',
    question: 'Choose the correct sentence:',
    options: ["She don't like apples.", "She doesn't likes apples.", "She doesn't like apples.", "She not like apples."],
    correctAnswer: "She doesn't like apples.",
    correctIndex: 2,
    explanation: 'Dalam Simple Present Tense untuk subjek tunggal (She, He, It), bentuk negatifnya menggunakan "doesn\'t" diikuti verb dasar (infinitive tanpa to).',
    difficulty: 'easy',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'diag-fis-1',
    assessmentType: 'diagnostic',
    subjectId: 'fisika',
    subjectName: 'Fisika',
    competencyId: 'fis-mekanika',
    competencyName: 'Mekanika',
    subcompetency: 'Gerak Lurus',
    topic: 'Gerak Lurus Berubah Beraturan',
    stimulusType: 'none',
    question: 'Sebuah mobil melaju dengan kecepatan awal 10 m/s. Jika mobil dipercepat sebesar 2 m/s², kecepatan mobil setelah 5 detik adalah...',
    options: ['15 m/s', '20 m/s', '25 m/s', '30 m/s'],
    correctAnswer: '20 m/s',
    correctIndex: 1,
    explanation: 'Gunakan rumus GLBB: v = v0 + at. v = 10 + (2)(5) = 10 + 10 = 20 m/s.',
    difficulty: 'medium',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  }
];

export const TRYOUT_QUESTIONS: Question[] = [
  {
    id: 'to-ind-1',
    assessmentType: 'tryout',
    subjectId: 'indonesia',
    subjectName: 'Bahasa Indonesia',
    competencyId: 'ind-membaca',
    competencyName: 'Membaca Komprehensif',
    subcompetency: 'Ide Pokok Paragraf',
    topic: 'Ide Pokok',
    stimulusType: 'text',
    stimulus: 'Tidur yang cukup sangat penting bagi kesehatan tubuh. Saat tidur, tubuh melakukan perbaikan sel-sel yang rusak dan mengatur ulang sistem kekebalan. Kekurangan tidur dapat memicu berbagai penyakit, seperti obesitas dan diabetes. Oleh karena itu, usahakan tidur 7-8 jam setiap malam.',
    question: 'Ide pokok paragraf tersebut adalah...',
    options: ['Tidur memicu obesitas dan diabetes.', 'Pentingnya tidur yang cukup bagi kesehatan tubuh.', 'Tubuh memperbaiki sel-sel saat tidur.', 'Usahakan tidur 7-8 jam setiap malam.'],
    correctAnswer: 'Pentingnya tidur yang cukup bagi kesehatan tubuh.',
    correctIndex: 1,
    explanation: 'Kalimat utama terletak di awal paragraf (deduktif). Semua kalimat berikutnya adalah kalimat penjelas yang mendukung pentingnya tidur bagi kesehatan tubuh.',
    difficulty: 'medium',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'to-mat-1',
    assessmentType: 'tryout',
    subjectId: 'matematika',
    subjectName: 'Matematika',
    competencyId: 'mat-aljabar',
    competencyName: 'Aljabar',
    subcompetency: 'Barisan dan Deret',
    topic: 'Barisan Aritmatika',
    stimulusType: 'none',
    question: 'Suku ke-n dari barisan 2, 5, 8, 11... adalah...',
    options: ['3n - 1', '3n + 1', '2n + 1', '2n - 1'],
    correctAnswer: '3n - 1',
    correctIndex: 0,
    explanation: 'Ini adalah barisan aritmatika dengan suku pertama a=2 dan beda b=3. Rumus suku ke-n adalah Un = a + (n-1)b = 2 + (n-1)3 = 3n - 1.',
    difficulty: 'medium',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'to-ing-1',
    assessmentType: 'tryout',
    subjectId: 'inggris',
    subjectName: 'Bahasa Inggris',
    competencyId: 'ing-vocab',
    competencyName: 'Vocabulary',
    subcompetency: 'Synonym and Antonym',
    topic: 'Vocabulary Context',
    stimulusType: 'text',
    stimulus: 'The region is known for its abundant natural resources, particularly coal and iron, which have fueled its industrial growth for decades.',
    question: 'The antonym of the word "abundant" in the text is...',
    options: ['Plentiful', 'Scarce', 'Heavy', 'Clear'],
    correctAnswer: 'Scarce',
    correctIndex: 1,
    explanation: '"Abundant" artinya berlimpah. Antonimnya adalah "scarce" yang berarti langka atau sedikit.',
    difficulty: 'easy',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  },
  {
    id: 'to-fis-1',
    assessmentType: 'tryout',
    subjectId: 'fisika',
    subjectName: 'Fisika',
    competencyId: 'fis-mekanika',
    competencyName: 'Mekanika',
    subcompetency: 'Hukum Newton',
    topic: 'Hukum II Newton',
    stimulusType: 'none',
    question: 'Sebuah balok bermassa 5 kg ditarik dengan gaya mendatar sebesar 20 N di atas lantai licin. Percepatan balok tersebut adalah...',
    options: ['2 m/s²', '4 m/s²', '5 m/s²', '100 m/s²'],
    correctAnswer: '4 m/s²',
    correctIndex: 1,
    explanation: 'Gunakan Hukum II Newton: F = m * a. Sehingga a = F / m = 20 / 5 = 4 m/s².',
    difficulty: 'easy',
    sourceTitle: 'Bank Soal Internal',
    sourceUrl: '',
    validationStatus: 'verified',
    contentType: 'text',
    reviewedAt: '2026-08-30'
  }
];

export const TOPICS: Record<string, any[]> = {
  'indonesia': [
    {
      id: 'indonesia-makna-kata',
      subjectId: 'indonesia',
      title: 'Makna Kata',
      competency: 'Membaca Komprehensif',
      summary: 'Memahami makna kata berdasarkan konteks kalimat sangat penting dalam membaca komprehensif.',
      content: 'Makna kata bisa berupa makna leksikal (sesuai kamus) atau makna gramatikal (sesuai konteks kalimat). Dalam ujian, kamu sering diminta mencari makna kata dalam sebuah paragraf. Pastikan kamu membaca kalimat utuh untuk memahami konteksnya.',
      questions: [
        {
          id: 'prac-ind-1',
          assessmentType: 'practice',
          subjectId: 'indonesia',
          subjectName: 'Bahasa Indonesia',
          competencyId: 'ind-membaca',
          competencyName: 'Membaca Komprehensif',
          subcompetency: 'Menentukan Makna Kata',
          topic: 'Makna Kata',
          stimulusType: 'text',
          stimulus: 'Pemerintah daerah menggalakkan program reboisasi untuk mencegah bencana tanah longsor di musim penghujan.',
          question: 'Makna kata "reboisasi" dalam kalimat tersebut adalah...',
          options: ['Penghijauan kembali', 'Penebangan liar', 'Pembersihan selokan', 'Pembangunan waduk'],
          correctAnswer: 'Penghijauan kembali',
          correctIndex: 0,
          explanation: 'Reboisasi berarti penanaman kembali hutan yang telah ditebang, atau penghijauan kembali.',
          difficulty: 'easy',
          sourceTitle: 'Bank Soal Internal',
          sourceUrl: '',
          validationStatus: 'verified',
          contentType: 'text',
          reviewedAt: '2026-08-30'
        }
      ]
    }
  ],
  'matematika': [
    {
      id: 'matematika-faktorisasi',
      subjectId: 'matematika',
      title: 'Faktorisasi Persamaan Kuadrat',
      competency: 'Aljabar',
      summary: 'Faktorisasi adalah salah satu cara menyelesaikan persamaan kuadrat selain menggunakan rumus ABC.',
      content: 'Bentuk umum persamaan kuadrat adalah ax² + bx + c = 0. Untuk memfaktorkannya (jika a=1), carilah dua bilangan yang jika dijumlahkan hasilnya b, dan jika dikalikan hasilnya c.',
      questions: [
        {
          id: 'prac-mat-2',
          assessmentType: 'practice',
          subjectId: 'matematika',
          subjectName: 'Matematika',
          competencyId: 'mat-aljabar',
          competencyName: 'Aljabar',
          subcompetency: 'Persamaan Kuadrat',
          topic: 'Faktorisasi Persamaan Kuadrat',
          stimulusType: 'none',
          question: 'Akar-akar dari persamaan kuadrat x² + 7x + 12 = 0 adalah...',
          options: ['x=3 atau x=4', 'x=-3 atau x=-4', 'x=2 atau x=6', 'x=-2 atau x=-6'],
          correctAnswer: 'x=-3 atau x=-4',
          correctIndex: 1,
          explanation: 'Dua angka yang dijumlahkan hasil 7 dan dikalikan hasil 12 adalah 3 dan 4. Faktornya: (x+3)(x+4)=0, sehingga x=-3 atau x=-4.',
          difficulty: 'medium',
          sourceTitle: 'Bank Soal Internal',
          sourceUrl: '',
          validationStatus: 'verified',
          contentType: 'text',
          reviewedAt: '2026-08-30'
        }
      ]
    },
    {
      id: 'matematika-peluang',
      subjectId: 'matematika',
      title: 'Peluang dan Kombinatorika',
      competency: 'Kombinatorika Dasar',
      summary: 'Kombinasi adalah cara memilih anggota dari himpunan tanpa memperhatikan urutan.',
      content: 'Kombinasi C(n, k) = n! / (k!(n-k)!). Berbeda dengan permutasi, pada kombinasi susunan AB dianggap sama dengan BA.',
      questions: [
        {
          id: 'prac-mat-1',
          assessmentType: 'practice',
          subjectId: 'matematika',
          subjectName: 'Matematika',
          competencyId: 'mat-peluang',
          competencyName: 'Kombinatorika Dasar',
          subcompetency: 'Kombinasi',
          topic: 'Kombinasi',
          stimulusType: 'none',
          question: 'Dari 8 siswa akan dipilih 3 orang untuk menjadi pengurus kelas. Banyaknya cara pemilihan adalah...',
          options: ['24', '56', '120', '336'],
          correctAnswer: '56',
          correctIndex: 1,
          explanation: 'Gunakan rumus kombinasi C(8,3) = 8! / (3! * 5!) = (8 * 7 * 6) / (3 * 2 * 1) = 56.',
          difficulty: 'medium',
          sourceTitle: 'Bank Soal Internal',
          sourceUrl: '',
          validationStatus: 'verified',
          contentType: 'text',
          reviewedAt: '2026-08-30'
        }
      ]
    }
  ],
  'inggris': [
    {
      id: 'inggris-sva',
      subjectId: 'inggris',
      title: 'Subject-Verb Agreement',
      competency: 'Grammar and Structure',
      summary: 'Subjek tunggal membutuhkan kata kerja tunggal, dan subjek jamak membutuhkan kata kerja jamak.',
      content: 'Dalam Simple Present Tense, subjek He, She, It ditambahkan s/es pada kata kerjanya (contoh: He runs). Untuk kalimat negatif, gunakan "does not" (doesn\'t) ditambah verb dasar.',
      questions: [
        {
          id: 'prac-ing-1',
          assessmentType: 'practice',
          subjectId: 'inggris',
          subjectName: 'Bahasa Inggris',
          competencyId: 'ing-grammar',
          competencyName: 'Grammar and Structure',
          subcompetency: 'Simple Present Tense',
          topic: 'Subject-Verb Agreement',
          stimulusType: 'none',
          question: 'My brother _____ a lot of books in his room.',
          options: ['have', 'has', 'having', 'is have'],
          correctAnswer: 'has',
          correctIndex: 1,
          explanation: '"My brother" adalah subjek tunggal (He), sehingga membutuhkan kata kerja tunggal "has".',
          difficulty: 'easy',
          sourceTitle: 'Bank Soal Internal',
          sourceUrl: '',
          validationStatus: 'verified',
          contentType: 'text',
          reviewedAt: '2026-08-30'
        }
      ]
    }
  ],
  'fisika': [
    {
      id: 'fisika-glbb',
      subjectId: 'fisika',
      title: 'Gerak Lurus Berubah Beraturan',
      competency: 'Mekanika',
      summary: 'GLBB adalah gerak suatu benda pada lintasan lurus dengan percepatan tetap.',
      content: 'Rumus utama GLBB:\n1. v = v0 + at\n2. s = v0t + 1/2 at²\n3. v² = v0² + 2as\ndimana v0 = kecepatan awal, v = kecepatan akhir, a = percepatan, s = jarak, t = waktu.',
      questions: [
        {
          id: 'prac-fis-1',
          assessmentType: 'practice',
          subjectId: 'fisika',
          subjectName: 'Fisika',
          competencyId: 'fis-mekanika',
          competencyName: 'Mekanika',
          subcompetency: 'Gerak Lurus',
          topic: 'Gerak Lurus Berubah Beraturan',
          stimulusType: 'none',
          question: 'Sebuah benda diam mulai bergerak dengan percepatan 3 m/s². Jarak yang ditempuh setelah 4 detik adalah...',
          options: ['12 m', '24 m', '36 m', '48 m'],
          correctAnswer: '24 m',
          correctIndex: 1,
          explanation: 'Gunakan rumus s = v0t + 1/2 at². v0 = 0. s = 0 + 1/2 * 3 * (4²) = 1/2 * 3 * 16 = 24 meter.',
          difficulty: 'medium',
          sourceTitle: 'Bank Soal Internal',
          sourceUrl: '',
          validationStatus: 'verified',
          contentType: 'text',
          reviewedAt: '2026-08-30'
        }
      ]
    }
  ]
};

export const TRYOUTS = [
  {
    id: 'to-1',
    title: 'Tryout TKA 1',
    description: 'Simulasi tryout dengan komposisi materi campuran.',
    durationMinutes: 15,
    questions: TRYOUT_QUESTIONS
  }
];

