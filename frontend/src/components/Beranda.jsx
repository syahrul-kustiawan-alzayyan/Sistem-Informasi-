import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import img1 from '../assets/carraousel/453593504_17965310477786376_5414867868920742916_n.jpg'; // Update with your image paths
import img2 from '../assets/carraousel/453631339_17965310504786376_5877906543981074323_n.jpg'; // Update with your image paths
import img3 from '../assets/carraousel/453647283_17965310486786376_8795307269901073889_n.jpg';
import './beranda.css';

function Beranda() {
  return (
    <div id= 'home' className='beranda'>
        <Container className="utama mt-5">
        <Row>
        <Col md={5}>
            <Carousel>
                <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={img1}
                    alt="First slide"
                />
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={img2}
                    alt="Second slide"
                />
                </Carousel.Item>
                <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={img3}
                    alt="Third slide"
                />
                </Carousel.Item>
            </Carousel>
            </Col>  
            <Col md={6}>
            <h2>Selamat Datang di Halaman Pendaftaran Majelis Taklim Kabupaten Garut</h2>
            <p>
                Kami dengan bangga mempersembahkan kesempatan bagi seluruh masyarakat Kabupaten Garut untuk bergabung dalam kegiatan keagamaan yang penuh makna dan manfaat melalui Majelis Taklim. Majelis Taklim merupakan wadah yang dirancang untuk memperdalam pengetahuan agama, membangun komunitas yang lebih harmonis, serta memperkuat tali silaturahmi antar sesama.
            </p>
            <h3>Tentang Majelis Taklim Kabupaten Garut</h3>
            <p>
                Majelis Taklim Kabupaten Garut adalah sebuah inisiatif yang bertujuan untuk meningkatkan pemahaman agama dan memberikan pendidikan spiritual kepada masyarakat. Dalam setiap majelis taklim, Anda akan mendapatkan berbagai materi pembelajaran yang disampaikan oleh ulama dan penceramah berpengalaman. Selain itu, kegiatan ini juga mencakup diskusi, tanya jawab, dan berbagai aktivitas keagamaan yang dapat memperkaya pengalaman spiritual Anda.
            </p>
            </Col>
            
        </Row>
        </Container>
    </div>
  );
}

export default Beranda;
