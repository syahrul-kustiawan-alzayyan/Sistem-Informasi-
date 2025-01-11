import React from 'react';
import { Container, Card } from 'react-bootstrap';
import './faq.css'; // Import the CSS file

function FAQ() {
    const faqs = [
        {
            question: "Apa saja persyaratan untuk mendaftarkan Majelis Taklim?",
            answer: "Persyaratan meliputi Surat Permohonan, Rekomendasi KUA Kecamatan, Susunan Kepengurusan, Surat Keterangan Domisili dari kepala desa, Daftar Jamaah, Fotocopy KTP pengurus dan jamaah, serta dokumen pendukung lainnya."
        },
        {
            question: "Berapa lama proses pendaftaran Majelis Taklim?",
            answer: "Proses pendaftaran biasanya memakan waktu sekitar 7-14 hari kerja, tergantung kelengkapan dokumen dan antrian permohonan."
        },
        {
            question: "Apakah pendaftaran Majelis Taklim dikenakan biaya?",
            answer: "Pendaftaran Majelis Taklim tidak dikenakan biaya alias gratis."
        },
        {
            question: "Bagaimana cara mengajukan pendaftaran secara online?",
            answer: "Anda dapat mengajukan pendaftaran secara online melalui situs resmi Kabupaten Garut dengan mengikuti langkah-langkah yang ada di halaman pendaftaran."
        },
        {
            question: "Apa yang harus dilakukan jika pengajuan pendaftaran ditolak?",
            answer: "Jika pengajuan ditolak, Anda harus memperbaiki dan melengkapi dokumen yang kurang sesuai dengan ketentuan yang telah ditetapkan, kemudian ajukan kembali."
        }
    ];

    return (
        <Container id='faq' className="my-5">
            <h2 className="text-center mb-5">Pertanyaan Yang Sering Ditanyakan (FAQ)</h2>
            <Card className="faq-card p-4 shadow-sm">
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-3">
                        <h5 className="faq-question">{faq.question}</h5>
                        <p className="faq-answer">{faq.answer}</p>
                    </div>
                ))}
            </Card>
        </Container>
    );
}

export default FAQ;
