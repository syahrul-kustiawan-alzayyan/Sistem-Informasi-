const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const MajelisTaklimModel = require('./models/MajelisTaklim');
const PengajuanPembaharuanModel = require("./models/PengajuanPembaharuan");
const PengajuanBaruModel = require("./models/PengajuanBaru");
const router = express.Router();

// Initialize express
const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage })

// Middleware configurations
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","DELETE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(bodyParser.json());  // Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/simasdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Anda harus login terlebih dahulu" });
    }

    jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid" });
        }
        req.user = decoded; // Attach user info to request object
        next(); // Continue to the next middleware or route handler
    });
};

// Create admin account
const createAdminAccount = async () => {
    try {
        const adminExists = await UserModel.findOne({ username: 'adminkemenag' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('simaskemenag321', 10);
            await UserModel.create({
                username: 'adminkemenag',
                password: hashedPassword,
                role: 'admin'
            });
            console.log("Admin account created");
        } else {
            console.log("Admin account already exists");
        }
    } catch (err) {
        console.error('Error creating admin account:', err);
    }
};

// Create the admin account upon server start
createAdminAccount();

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    UserModel.findOne({ username })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ username: user.username, role: user.role, id: user._id }, "secretkey", { expiresIn: "1h" });
                        res.cookie('token', token);
                        return res.json({ Status: "Sukses", role: user.role });
                    } else {
                        res.json("password salah");
                    }
                });
            } else {
                res.json("username tidak terdaftar");
            }
        })
        .catch(err => res.json(err));
});

// Registration route
app.post('/register', (req, res) => {
    const { username, phone, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ username, phone, password: hash, role: 'user' })
                .then(user => res.json(user))
                .catch(err => res.json(err));
        })
        .catch(err => console.log(err.message));
});

app.get('/majelistaklim', (req,res) => {
    MajelisTaklimModel.find()
    .then(MajelisTaklim => res.json(MajelisTaklim))
    .catch(err => res.json(err))
})
app.get('/Pengajuanbaru', (req,res) => {
    PengajuanBaruModel.find()
    .then(PengajuanBaru => res.json(PengajuanBaru))
    .catch(err => res.json(err))
})
app.get('/Pengajuanpembaharuan', (req,res) => {
    PengajuanPembaharuanModel.find()
    .then(PengajuanPembaharuan => res.json(PengajuanPembaharuan))
    .catch(err => res.json(err))
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/pengajuanbaru', upload.fields([
    { name: 'suratPermohonan', maxCount: 1 },
    { name: 'rekomendasiKUA', maxCount: 1 },
    { name: 'susunanKepengurusan', maxCount: 1 },
    { name: 'suratDomisili', maxCount: 1 },
    { name: 'daftarJamaah', maxCount: 1 },
    { name: 'ktpPengurus', maxCount: 1 },
    { name: 'ktpJamaah', maxCount: 1 },
    { name: 'aktaYayasan', maxCount: 1 },
    { name: 'proposalPengajuan', maxCount: 1 }
  ]), (req, res) => {
    console.log('Received request to /daftarbaru');
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
  
    const baseUrl = 'http://localhost:3002/uploads';
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey'); // Ganti 'secret' dengan key JWT Anda
    const userId = decoded.id;


    const pengajuanBaruData = {
    ...req.body,
    userId,
    suratPermohonan: req.files['suratPermohonan'] ? `${baseUrl}/${req.files['suratPermohonan'][0].filename}` : '',
    rekomendasiKUA: req.files['rekomendasiKUA'] ? `${baseUrl}/${req.files['rekomendasiKUA'][0].filename}` : '',
    susunanKepengurusan: req.files['susunanKepengurusan'] ? `${baseUrl}/${req.files['susunanKepengurusan'][0].filename}` : '',
    suratDomisili: req.files['suratDomisili'] ? `${baseUrl}/${req.files['suratDomisili'][0].filename}` : '',
    daftarJamaah: req.files['daftarJamaah'] ? `${baseUrl}/${req.files['daftarJamaah'][0].filename}` : '',
    ktpPengurus: req.files['ktpPengurus'] ? `${baseUrl}/${req.files['ktpPengurus'][0].filename}` : '',
    ktpJamaah: req.files['ktpJamaah'] ? `${baseUrl}/${req.files['ktpJamaah'][0].filename}` : '',
    aktaYayasan: req.files['aktaYayasan'] ? `${baseUrl}/${req.files['aktaYayasan'][0].filename}` : '',
    proposalPengajuan: req.files['proposalPengajuan'] ? `${baseUrl}/${req.files['proposalPengajuan'][0].filename}` : '',
    };

  
    console.log('Processed PengajuanBaruData:', pengajuanBaruData);
  
    PengajuanBaruModel.create(pengajuanBaruData)
      .then(Pengajuanbaru => {
        console.log('Successfully created MajelisTaklim:', Pengajuanbaru);
        res.json({ status: "sukses", Pengajuanbaru });
      })
      .catch(err => {
        console.error('Error creating MajelisTaklim:', err);
        res.status(400).json({ status: "error", message: err.message });
      });
  });

  app.post('/pengajuanpembaharuan', upload.fields([
    { name: 'suratPermohonan', maxCount: 1 },
    { name: 'rekomendasiKUA', maxCount: 1 },
    { name: 'susunanKepengurusan', maxCount: 1 },
    { name: 'suratDomisili', maxCount: 1 },
    { name: 'daftarJamaah', maxCount: 1 },
    { name: 'ktpPengurus', maxCount: 1 },
    { name: 'ktpJamaah', maxCount: 1 },
    { name: 'aktaYayasan', maxCount: 1 },
    { name: 'proposalPengajuan', maxCount: 1 }
  ]), (req, res) => {
    console.log('Received request to /pengajuanpembaharuan');
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
  
    const baseUrl = 'http://localhost:3002/uploads';
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.id;

    const pengajuanPembaharuanData = {
    ...req.body,
    userId,
    suratPermohonan: req.files['suratPermohonan'] ? `${baseUrl}/${req.files['suratPermohonan'][0].filename}` : '',
    rekomendasiKUA: req.files['rekomendasiKUA'] ? `${baseUrl}/${req.files['rekomendasiKUA'][0].filename}` : '',
    susunanKepengurusan: req.files['susunanKepengurusan'] ? `${baseUrl}/${req.files['susunanKepengurusan'][0].filename}` : '',
    suratDomisili: req.files['suratDomisili'] ? `${baseUrl}/${req.files['suratDomisili'][0].filename}` : '',
    daftarJamaah: req.files['daftarJamaah'] ? `${baseUrl}/${req.files['daftarJamaah'][0].filename}` : '',
    ktpPengurus: req.files['ktpPengurus'] ? `${baseUrl}/${req.files['ktpPengurus'][0].filename}` : '',
    ktpJamaah: req.files['ktpJamaah'] ? `${baseUrl}/${req.files['ktpJamaah'][0].filename}` : '',
    aktaYayasan: req.files['aktaYayasan'] ? `${baseUrl}/${req.files['aktaYayasan'][0].filename}` : '',
    proposalPengajuan: req.files['proposalPengajuan'] ? `${baseUrl}/${req.files['proposalPengajuan'][0].filename}` : '',
    };

  
    console.log('Processed PengajuanPembaharuanData:', pengajuanPembaharuanData);
  
    PengajuanPembaharuanModel.create(pengajuanPembaharuanData)
      .then(Pengajuanpembaharuan => {
        console.log('Successfully created MajelisTaklim:', Pengajuanpembaharuan);
        res.json({ status: "sukses", Pengajuanpembaharuan });
      })
      .catch(err => {
        console.error('Error creating MajelisTaklim:', err);
        res.status(400).json({ status: "error", message: err.message });
      });
  });

  app.get('/stats/kecamatan', async (req, res) => {
    MajelisTaklimModel.find()
    .then(async MajelisTaklim => {
        const data = await MajelisTaklimModel.aggregate([
            { $group: { _id: '$kecamatan', count: { $sum: 1 } } },
            { $sort: { count: -1 } },  // Optional, to sort by number of Majelis Taklim
          ]);
          res.json(data);
    })
    .catch (err =>{
        console.error('Error in /stats/kecamatan:', err);
      res.status(500).json({ message: 'Error fetching kecamatan stats' });
    }) 
      
  });
  
  
  
  
  // Statistik total majelis taklim dan jamaah
  app.get('/stats/totalmajelistaklim', async (req, res) => {
    MajelisTaklimModel.find()
    .then(async MajelisTaklim => {
        const totalMajelis = await MajelisTaklimModel.countDocuments();
      res.json({
        totalMajelis,
      });
    }) 
    .catch (err => {
    console.error('Error in /stats/total:', err);
      res.status(500).json({ message: 'Error fetching total stats' });
    })
      
  });

  app.get('/stats/totalpengajuanbaru', async (req, res) => {
    PengajuanBaruModel.find()
    .then(async PengajuanBaru => {
        const totalPengajuanBaru = await PengajuanBaruModel.countDocuments();
      res.json({
        totalPengajuanBaru,
      });
    }) 
    .catch (err => {
    console.error('Error in /stats/total:', err);
      res.status(500).json({ message: 'Error fetching total stats' });
    })    
  });

  app.get('/stats/totalpengajuanpembaharuan', async (req, res) => {
    PengajuanPembaharuanModel.find()
    .then(async PengajuanPembaharuan => {
        const totalPengajuanPembaharuan = await PengajuanPembaharuanModel.countDocuments();
      res.json({
        totalPengajuanPembaharuan,
      });
    }) 
    .catch (err => {
    console.error('Error in /stats/total:', err);
      res.status(500).json({ message: 'Error fetching total stats' });
    })   
  });


  app.post('/approveMajelisTaklim', isAuthenticated, async (req, res) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ message: 'ID is required' });
    }
  
    try {
      const pengajuan = await PengajuanBaruModel.findById(_id); // Find the entry by ID
      if (!pengajuan) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      pengajuan.status = 'approved'; // Set the status to 'approved'
      await pengajuan.save(); // Save the updated document
  
      res.status(200).json({
        message: `Data with ID ${_id} has been approved successfully.`,
        approvedData: pengajuan,
      });
    } catch (err) {
      console.error('Error in approving Majelis Taklim:', err);
      res.status(500).json({ message: 'Error approving Majelis Taklim' });
    }
  });

  app.post('/majelistaklim', async (req, res) => {
    try {
      const selectedPengajuanBaru = req.body; // Assuming selectedPengajuanBaru is sent in the request body
  
      // Create a new entry in the MajelisTaklim collection
      const newEntry = new MajelisTaklimModel({
        userId: selectedPengajuanBaru.userId,
        tanggal: selectedPengajuanBaru.tanggal,
        namaPemohon: selectedPengajuanBaru.namaPemohon,
        alamatPemohon: selectedPengajuanBaru.alamatPemohon,
        noHpPemohon: selectedPengajuanBaru.noHpPemohon,
        namaMajelis: selectedPengajuanBaru.namaMajelis,
        alamatMajelis: selectedPengajuanBaru.alamatMajelis,
        kecamatan: selectedPengajuanBaru.kecamatan,
        kelurahan: selectedPengajuanBaru.kelurahan,
        namaPimpinan: selectedPengajuanBaru.namaPimpinan,
        noHpPimpinan: selectedPengajuanBaru.noHpPimpinan,
        tahunBerdiri: selectedPengajuanBaru.tahunBerdiri,
        jumlahJamaah: selectedPengajuanBaru.jumlahJamaah,
        penyelenggara: selectedPengajuanBaru.penyelenggara,
        suratPermohonan: selectedPengajuanBaru.suratPermohonan,
        rekomendasiKUA: selectedPengajuanBaru.rekomendasiKUA,
        susunanKepengurusan: selectedPengajuanBaru.susunanKepengurusan,
        suratDomisili: selectedPengajuanBaru.suratDomisili,
        daftarJamaah: selectedPengajuanBaru.daftarJamaah,
        ktpPengurus: selectedPengajuanBaru.ktpPengurus,
        ktpJamaah: selectedPengajuanBaru.ktpJamaah,
        aktaYayasan: selectedPengajuanBaru.aktaYayasan,
        proposalPengajuan: selectedPengajuanBaru.proposalPengajuan,
        status: { type: String, enum: ['pending', 'disetujui', 'ditolak'], default: 'pending' },
        pesanPenolakan: { type: String, default: '' },
      });
  
      // Save the new data in MajelisTaklim
      await newEntry.save();
  
      // Delete the data from PengajuanBaru collection using the ID
      await PengajuanBaruModel.findByIdAndDelete(selectedPengajuanBaru._id);
  
      // Send success response
      res.status(200).json({ message: 'Data berhasil dipindahkan!' });
  
    } catch (err) {
      console.error('Error while moving data:', err);
      res.status(500).json({ message: 'Gagal memindahkan data!' });
    }
  });

  app.delete('/majelistaklim/:id', async (req, res) => {
    const { _id } = req.params;
    try {
      // Find and delete the Majelis Taklim by ID
      const result = await MajelisTaklimModel.findByIdAndDelete(_id);
  
      if (!result) {
        return res.status(404).json({ message: 'Majelis Taklim not found' });
      }
      res.status(200).json({ message: 'Majelis Taklim successfully deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Majelis Taklim', error });
    }
  });
  
  

  app.get("/status-pengajuan/:userId", async (req, res) => {
    try {
      // Mengambil data berdasarkan userId yang ada di request
      const dataPengajuan = await PengajuanBaruModel.find({ userId: mongoose.Types.ObjectId(req.userId) });
  
      if (dataPengajuan.length === 0) {
        return res.status(404).json({ message: "Tidak ada data pengajuan" });
      }
  
      res.json(dataPengajuan);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ message: "Gagal mengambil data pengajuan" });
    }
  });

  app.put('/update-pengajuanbaru/:id', async (req, res) => {
    const { id } = req.params;
    const { status, pesanPenolakan } = req.body;
    try {
      const PengajuanBaru = await PengajuanBaruModel.findById(id);
      if (!PengajuanBaru) return res.status(404).json({ error: 'Pengajuan not found' });
  
      PengajuanBaru.status = status;
      if (status === 'ditolak') PengajuanBaru.pesanPenolakan = pesanPenolakan;
      await PengajuanBaru.save();
  
      res.json({ message: 'Pengajuan updated successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Update failed' });
    }
  });
  
  app.put('/pengajuanbaru/:id', async (req, res) => {
    const { id } = req.params;
    const { status, pesanPenolakan } = req.body;
  
    try {
      // Validate that if status is "ditolak", pesanPenolakan is required
      if (status === 'ditolak' && !pesanPenolakan) {
        return res.status(400).json({ message: 'Pesan Penolakan is required when status is "ditolak"' });
      }
  
      // If status is "disetujui", we can clear the rejection message
      if (status === 'disetujui') {
        // Optionally clear pesanPenolakan if approved
        pesanPenolakan = '';
      }
  
      const updatedPengajuan = await PengajuanBaruModel.findByIdAndUpdate(
        id,
        { status, pesanPenolakan },
        { new: true }
      );
  
      if (!updatedPengajuan) {
        return res.status(404).json({ message: 'Pengajuan Baru not found' });
      }
  
      res.json(updatedPengajuan);
    } catch (error) {
      console.error('Error updating Pengajuan Baru:', error);
      res.status(500).json({ message: 'Error updating Pengajuan Baru', error });
    }
  });



// Start the server
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
