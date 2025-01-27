const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const MajelisTaklimModel = require("./models/MajelisTaklim");
const PengajuanPembaharuanModel = require("./models/PengajuanPembaharuan");
const PengajuanBaruModel = require("./models/PengajuanBaru");
const router = express.Router();

// Initialize express
const app = express();

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Middleware configurations
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json()); // Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/simasdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Anda harus login terlebih dahulu" });
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
    const adminExists = await UserModel.findOne({ username: "adminkemenag" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("simaskemenag321", 10);
      await UserModel.create({
        username: "adminkemenag",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Admin account created");
    } else {
      console.log("Admin account already exists");
    }
  } catch (err) {
    console.error("Error creating admin account:", err);
  }
};

// Create the admin account upon server start
createAdminAccount();

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username })
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign(
              { username: user.username, role: user.role, id: user._id },
              "secretkey",
              { expiresIn: "1h" }
            );
            res.cookie("token", token);
            return res.json({ Status: "Sukses", role: user.role });
          } else {
            res.json("password salah");
          }
        });
      } else {
        res.json("username tidak terdaftar");
      }
    })
    .catch((err) => res.json(err));
});

// Registration route
app.post("/register", (req, res) => {
  const { username, phone, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ username, phone, password: hash, role: "user" })
        .then((user) => res.json(user))
        .catch((err) => res.json(err));
    })
    .catch((err) => console.log(err.message));
});

app.get("/majelistaklim", (req, res) => {
  MajelisTaklimModel.find()
    .then((MajelisTaklim) => res.json(MajelisTaklim))
    .catch((err) => res.json(err));
});
app.get("/Pengajuanbaru", (req, res) => {
  PengajuanBaruModel.find({
    status: "pending",
  })
    .then((PengajuanBaru) => res.json(PengajuanBaru))
    .catch((err) => res.json(err));
});
app.get("/Pengajuanpembaharuan", (req, res) => {
  PengajuanPembaharuanModel.find({
    status: "pending",
  })
    .then((PengajuanPembaharuan) => res.json(PengajuanPembaharuan))
    .catch((err) => res.json(err));
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post(
  "/pengajuanbaru",
  upload.fields([
    { name: "suratPermohonan", maxCount: 1 },
    { name: "rekomendasiKUA", maxCount: 1 },
    { name: "susunanKepengurusan", maxCount: 1 },
    { name: "suratDomisili", maxCount: 1 },
    { name: "daftarJamaah", maxCount: 1 },
    { name: "ktpPengurus", maxCount: 1 },
    { name: "ktpJamaah", maxCount: 1 },
    { name: "aktaYayasan", maxCount: 1 },
    { name: "proposalPengajuan", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Received request to /daftarbaru");
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const baseUrl = "http://localhost:3002/uploads";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secretkey"); // Ganti 'secret' dengan key JWT Anda
    const userId = decoded.id;

    const pengajuanBaruData = {
      ...req.body,
      userId,
      suratPermohonan: req.files["suratPermohonan"]
        ? `${baseUrl}/${req.files["suratPermohonan"][0].filename}`
        : "",
      rekomendasiKUA: req.files["rekomendasiKUA"]
        ? `${baseUrl}/${req.files["rekomendasiKUA"][0].filename}`
        : "",
      susunanKepengurusan: req.files["susunanKepengurusan"]
        ? `${baseUrl}/${req.files["susunanKepengurusan"][0].filename}`
        : "",
      suratDomisili: req.files["suratDomisili"]
        ? `${baseUrl}/${req.files["suratDomisili"][0].filename}`
        : "",
      daftarJamaah: req.files["daftarJamaah"]
        ? `${baseUrl}/${req.files["daftarJamaah"][0].filename}`
        : "",
      ktpPengurus: req.files["ktpPengurus"]
        ? `${baseUrl}/${req.files["ktpPengurus"][0].filename}`
        : "",
      ktpJamaah: req.files["ktpJamaah"]
        ? `${baseUrl}/${req.files["ktpJamaah"][0].filename}`
        : "",
      aktaYayasan: req.files["aktaYayasan"]
        ? `${baseUrl}/${req.files["aktaYayasan"][0].filename}`
        : "",
      proposalPengajuan: req.files["proposalPengajuan"]
        ? `${baseUrl}/${req.files["proposalPengajuan"][0].filename}`
        : "",
    };

    console.log("Processed PengajuanBaruData:", pengajuanBaruData);

    PengajuanBaruModel.create(pengajuanBaruData)
      .then((Pengajuanbaru) => {
        console.log("Successfully created MajelisTaklim:", Pengajuanbaru);
        res.json({ status: "sukses", Pengajuanbaru });
      })
      .catch((err) => {
        console.error("Error creating MajelisTaklim:", err);
        res.status(400).json({ status: "error", message: err.message });
      });
  }
);

app.post("/updateStatus", async (req, res) => {
  try {
    const { id, status } = req.body; // Mengambil id dan status dari request body

    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("ID tidak valid:", id);
      return res.status(400).json({ message: "ID tidak valid!" });
    }

    // Validasi status
    const validStatuses = ["pending", "disetujui", "ditolak"];
    if (!validStatuses.includes(status)) {
      console.log("Status tidak valid:", status);
      return res.status(400).json({ message: "Status tidak valid!" });
    }

    // Update status pengajuan
    console.log("Mengupdate ID:", id, "Status:", status); // Log sebelum update
    const updatedPengajuan = await PengajuanBaruModel.findByIdAndUpdate(
      id,
      { status }, // Mengupdate status
      { new: true } // Mengembalikan dokumen setelah diupdate
    );

    if (!updatedPengajuan) {
      console.log("Pengajuan tidak ditemukan:", id);
      return res.status(404).json({ message: "Pengajuan tidak ditemukan!" });
    }
    if (status === "disetujui") {
      const newEntry = new MajelisTaklimModel({
        userId: updatedPengajuan.userId,
        tanggal: updatedPengajuan.tanggal,
        namaPemohon: updatedPengajuan.namaPemohon,
        alamatPemohon: updatedPengajuan.alamatPemohon,
        noHpPemohon: updatedPengajuan.noHpPemohon,
        namaMajelis: updatedPengajuan.namaMajelis,
        alamatMajelis: updatedPengajuan.alamatMajelis,
        kecamatan: updatedPengajuan.kecamatan,
        kelurahan: updatedPengajuan.kelurahan,
        namaPimpinan: updatedPengajuan.namaPimpinan,
        noHpPimpinan: updatedPengajuan.noHpPimpinan,
        tahunBerdiri: updatedPengajuan.tahunBerdiri,
        jumlahJamaah: updatedPengajuan.jumlahJamaah,
        penyelenggara: updatedPengajuan.penyelenggara,
        suratPermohonan: updatedPengajuan.suratPermohonan,
        rekomendasiKUA: updatedPengajuan.rekomendasiKUA,
        susunanKepengurusan: updatedPengajuan.susunanKepengurusan,
        suratDomisili: updatedPengajuan.suratDomisili,
        daftarJamaah: updatedPengajuan.daftarJamaah,
        ktpPengurus: updatedPengajuan.ktpPengurus,
        ktpJamaah: updatedPengajuan.ktpJamaah,
        aktaYayasan: updatedPengajuan.aktaYayasan,
        proposalPengajuan: updatedPengajuan.proposalPengajuan,
        status: updatedPengajuan.status,
        pesanPenolakan: updatedPengajuan.pesanPenolakan,
      });

    // Save the new data in MajelisTaklim
      await newEntry.save();

    // Delete the data from PengajuanBaru collection using the ID
      await PengajuanBaruModel.findByIdAndDelete(updatedPengajuan._id); 
    } 

    // Log jika berhasil
    console.log("Status berhasil diperbarui:", updatedPengajuan);

    // Mengirimkan respons sukses
    res.status(200).json({ 
      message: `Status berhasil diperbarui menjadi ${status}!`,
      data: updatedPengajuan 
    });
  } catch (err) {
    console.error("Error updating status:", err.message, err.stack);
    res.status(500).json({ message: "Gagal memperbarui status pengajuan!" });
  }
});


app.post(
  "/pengajuanpembaharuan",
  upload.fields([
    { name: "suratPermohonan", maxCount: 1 },
    { name: "rekomendasiKUA", maxCount: 1 },
    { name: "susunanKepengurusan", maxCount: 1 },
    { name: "suratDomisili", maxCount: 1 },
    { name: "daftarJamaah", maxCount: 1 },
    { name: "ktpPengurus", maxCount: 1 },
    { name: "ktpJamaah", maxCount: 1 },
    { name: "aktaYayasan", maxCount: 1 },
    { name: "proposalPengajuan", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("Received request to /pengajuanpembaharuan");
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const baseUrl = "http://localhost:3002/uploads";
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secretkey");
    const userId = decoded.id;

    const pengajuanPembaharuanData = {
      ...req.body,
      userId,
      suratPermohonan: req.files["suratPermohonan"]
        ? `${baseUrl}/${req.files["suratPermohonan"][0].filename}`
        : "",
      rekomendasiKUA: req.files["rekomendasiKUA"]
        ? `${baseUrl}/${req.files["rekomendasiKUA"][0].filename}`
        : "",
      susunanKepengurusan: req.files["susunanKepengurusan"]
        ? `${baseUrl}/${req.files["susunanKepengurusan"][0].filename}`
        : "",
      suratDomisili: req.files["suratDomisili"]
        ? `${baseUrl}/${req.files["suratDomisili"][0].filename}`
        : "",
      daftarJamaah: req.files["daftarJamaah"]
        ? `${baseUrl}/${req.files["daftarJamaah"][0].filename}`
        : "",
      ktpPengurus: req.files["ktpPengurus"]
        ? `${baseUrl}/${req.files["ktpPengurus"][0].filename}`
        : "",
      ktpJamaah: req.files["ktpJamaah"]
        ? `${baseUrl}/${req.files["ktpJamaah"][0].filename}`
        : "",
      aktaYayasan: req.files["aktaYayasan"]
        ? `${baseUrl}/${req.files["aktaYayasan"][0].filename}`
        : "",
      proposalPengajuan: req.files["proposalPengajuan"]
        ? `${baseUrl}/${req.files["proposalPengajuan"][0].filename}`
        : "",
    };

    console.log(
      "Processed PengajuanPembaharuanData:",
      pengajuanPembaharuanData
    );

    PengajuanPembaharuanModel.create(pengajuanPembaharuanData)
      .then((Pengajuanpembaharuan) => {
        console.log(
          "Successfully created MajelisTaklim:",
          Pengajuanpembaharuan
        );
        res.json({ status: "sukses", Pengajuanpembaharuan });
      })
      .catch((err) => {
        console.error("Error creating MajelisTaklim:", err);
        res.status(400).json({ status: "error", message: err.message });
      });
  }
);

app.get("/stats/kecamatan", async (req, res) => {
  MajelisTaklimModel.find()
    .then(async (MajelisTaklim) => {
      const data = await MajelisTaklimModel.aggregate([
        { $group: { _id: "$kecamatan", count: { $sum: 1 } } },
        { $sort: { count: -1 } }, // Optional, to sort by number of Majelis Taklim
      ]);
      res.json(data);
    })
    .catch((err) => {
      console.error("Error in /stats/kecamatan:", err);
      res.status(500).json({ message: "Error fetching kecamatan stats" });
    });
});

// Statistik total majelis taklim dan jamaah
app.get("/stats/totalmajelistaklim", async (req, res) => {
  MajelisTaklimModel.find()
    .then(async (MajelisTaklim) => {
      const totalMajelis = await MajelisTaklimModel.countDocuments();
      res.json({
        totalMajelis,
      });
    })
    .catch((err) => {
      console.error("Error in /stats/total:", err);
      res.status(500).json({ message: "Error fetching total stats" });
    });
});

app.get("/stats/totalpengajuanbaru", async (req, res) => {
  try {
    // Menghitung jumlah dokumen dengan status 'pending'
    const totalPengajuanBaru = await PengajuanBaruModel.countDocuments({ status: "pending" });
    res.json({
      totalPengajuanBaru,
    });
  } catch (err) {
    console.error("Error in /stats/totalpengajuanbaru:", err);
    res.status(500).json({ message: "Error fetching total stats" });
  }
});

app.get("/stats/totalpengajuanpembaharuan", async (req, res) => {
  PengajuanPembaharuanModel.find()
    .then(async (PengajuanPembaharuan) => {
      const totalPengajuanPembaharuan =
        await PengajuanPembaharuanModel.countDocuments({ status: "pending" });
      res.json({
        totalPengajuanPembaharuan,
      });
    })
    .catch((err) => {
      console.error("Error in /stats/total:", err);
      res.status(500).json({ message: "Error fetching total stats" });
    });
});

app.post("/approveMajelisTaklim", isAuthenticated, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const pengajuan = await PengajuanBaruModel.findById(_id); // Find the entry by ID
    if (!pengajuan) {
      return res.status(404).json({ message: "Data not found" });
    }

    pengajuan.status = "approved"; // Set the status to 'approved'
    await pengajuan.save(); // Save the updated document

    res.status(200).json({
      message: `Data with ID ${_id} has been approved successfully.`,
      approvedData: pengajuan,
    });
  } catch (err) {
    console.error("Error in approving Majelis Taklim:", err);
    res.status(500).json({ message: "Error approving Majelis Taklim" });
  }
});

app.post("/pengajuanbaruterima", async (req, res) => {
  try {
    const selectedPengajuanBaru = req.body; // Assuming selectedPengajuanBaru is sent in the request body
    // Update the status to 'Diterima' first
    const updatedPengajuan = await PengajuanBaruModel.findByIdAndUpdate(
      selectedPengajuanBaru._id, 
      { status: "Diterima" }, 
      { new: true } // This will return the updated document
    );

    // Check if update was successful
    if (!updatedPengajuan) {
      return res.status(404).json({ message: "Pengajuan tidak ditemukan!" });
    }

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
      status: selectedPengajuanBaru.status,
      pesanPenolakan: selectedPengajuanBaru.pesanPenolakan,
    });

    // Save the new data in MajelisTaklim
    await newEntry.save();

    // Delete the data from PengajuanBaru collection using the ID
    await PengajuanBaruModel.findByIdAndDelete(selectedPengajuanBaru._id);

    // Send success response
    res.status(200).json({ message: "Data berhasil dipindahkan dan status diperbarui!" });
  } catch (err) {
    console.error("Error while moving data:", err);
    res.status(500).json({ message: "Gagal memindahkan data dan memperbarui status!" });
  }
});

app.post("/majelistaklimbaru", async (req, res) => {
  try {
    const selectedPengajuanPembaharuan = req.body; // Assuming selectedPengajuanBaru is sent in the request body

    await PengajuanPembaharuanModel.findByIdAndUpdate(selectedPengajuanPembaharuan._id, {
      status: "Diterima",
    });

    // Create a new entry in the MajelisTaklim collection
    const newEntry = new MajelisTaklimModel({
      userId: selectedPengajuanPembaharuan.userId,
      tanggal: selectedPengajuanPembaharuan.tanggal,
      namaPemohon: selectedPengajuanPembaharuan.namaPemohon,
      alamatPemohon: selectedPengajuanPembaharuan.alamatPemohon,
      noHpPemohon: selectedPengajuanPembaharuan.noHpPemohon,
      namaMajelis: selectedPengajuanPembaharuan.namaMajelis,
      alamatMajelis: selectedPengajuanPembaharuan.alamatMajelis,
      kecamatan: selectedPengajuanPembaharuan.kecamatan,
      kelurahan: selectedPengajuanPembaharuan.kelurahan,
      namaPimpinan: selectedPengajuanPembaharuan.namaPimpinan,
      noHpPimpinan: selectedPengajuanPembaharuan.noHpPimpinan,
      tahunBerdiri: selectedPengajuanPembaharuan.tahunBerdiri,
      jumlahJamaah: selectedPengajuanPembaharuan.jumlahJamaah,
      penyelenggara: selectedPengajuanPembaharuan.penyelenggara,
      suratPermohonan: selectedPengajuanPembaharuan.suratPermohonan,
      rekomendasiKUA: selectedPengajuanPembaharuan.rekomendasiKUA,
      susunanKepengurusan: selectedPengajuanPembaharuan.susunanKepengurusan,
      suratDomisili: selectedPengajuanPembaharuan.suratDomisili,
      daftarJamaah: selectedPengajuanPembaharuan.daftarJamaah,
      ktpPengurus: selectedPengajuanPembaharuan.ktpPengurus,
      ktpJamaah: selectedPengajuanPembaharuan.ktpJamaah,
      aktaYayasan: selectedPengajuanPembaharuan.aktaYayasan,
      proposalPengajuan: selectedPengajuanPembaharuan.proposalPengajuan,
      status: selectedPengajuanPembaharuan.status,
      pesanPenolakan: selectedPengajuanPembaharuan.pesanPenolakan,
    });

    // Save the new data in MajelisTaklim
    await newEntry.save();

    // Delete the data from PengajuanPembaharuan collection using the ID
    await PengajuanPembaharuanModel.findByIdAndDelete(selectedPengajuanPembaharuan._id);

    // Send success response
    res.status(200).json({ message: "Data berhasil dipindahkan!" });
  } catch (err) {
    console.error("Error while moving data:", err);
    res.status(500).json({ message: "Gagal memindahkan data!" });
  }
});

app.delete("/majelistaklim/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the Majelis Taklim by ID
    const result = await MajelisTaklimModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Majelis Taklim not found" });
    }
    res.status(200).json({ message: "Majelis Taklim successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Majelis Taklim", error });
  }
});

app.get("/status-pengajuan", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Validasi apakah header authorization ada
    if (!authHeader) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    // Ekstrak token dari header
    const token = authHeader.split(" ")[1];

    // Verifikasi token
    const decoded = jwt.verify(token, "secretkey"); // Ganti "SECRET_KEY" dengan kunci rahasia Anda

    // Gunakan ID pengguna dari token yang terverifikasi
    const userId = decoded.id;

    // Query database menggunakan userId
    const dataPengajuan = await PengajuanBaruModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const dataMajelis = await MajelisTaklimModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    const dataPengajuanPembaharuan = await PengajuanPembaharuanModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    });

    // Validasi apakah data ditemukan
    if (dataPengajuan.length === 0 && dataMajelis.length === 0 && dataPengajuanPembaharuan.length === 0) {
      return res.status(404).json({ message: "Tidak ada data yang ditemukan" });
    }

    res.json({ dataPengajuan, dataPengajuanPembaharuan, dataMajelis });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Gagal mengambil data pengajuan" });
  }
});


app.put("/update-pengajuanbaru/:id", async (req, res) => {
  const { id } = req.params;
  const { status, pesanPenolakan } = req.body; // Pastikan status dan pesanPenolakan diterima dari request body
  
  try {
    // Mencari pengajuan berdasarkan ID
    const PengajuanBaru = await PengajuanBaruModel.findById(id);
    if (!PengajuanBaru)
      return res.status(404).json({ error: "Pengajuan not found" });

    // Memperbarui status pengajuan
    PengajuanBaru.status = status;
    
    // Jika status ditolak, set pesan penolakan
    if (status === "ditolak") {
      PengajuanBaru.pesanPenolakan = pesanPenolakan;
    }

    // Simpan perubahan ke database
    await PengajuanBaru.save();

    // Mengirimkan respons sukses
    res.json({ message: "Pengajuan berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating pengajuan:", error);
    res.status(400).json({ error: "Update gagal!" });
  }
});


app.put("/update-pengajuanpembaharuan/:id", async (req, res) => {
  const { id } = req.params;
  const { status, pesanPenolakan } = req.body;
  try {
    const PengajuanPembaharuan = await PengajuanPembaharuan.findById(id);
    if (!PengajuanPembaharuan)
      return res.status(404).json({ error: "Pengajuan not found" });

    PengajuanPembaharuan.status = status;
    if (status === "ditolak") PengajuanPembaharuan.pesanPenolakan = pesanPenolakan;
    await PengajuanPembaharuan.save();

    res.json({ message: "Pengajuan updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});

app.put("/pengajuanbaru/:id", async (req, res) => {
  const { id } = req.params;
  const { status, pesanPenolakan } = req.body.data;

  console.log(status);
  try {
    // Validate that if status is "ditolak", pesanPenolakan is required
    if (status === "ditolak" && !pesanPenolakan) {
      return res.status(400).json({
        message: 'Pesan Penolakan is required when status is "ditolak"',
      });
    }

    // If status is "disetujui", we can clear the rejection message
    if (status === "disetujui") {
      // Optionally clear pesanPenolakan if approved
      pesanPenolakan = "";
    }
    const updatedPengajuan = await PengajuanBaruModel.findByIdAndUpdate(id, {
      status: status,
      pesanPenolakan: "",
    });

    if (!updatedPengajuan) {
      return res.status(404).json({ message: "Pengajuan Baru not found" });
    }

    res.json(updatedPengajuan);
  } catch (error) {
    console.error("Error updating Pengajuan Baru:", error);
    res.status(500).json({ message: "Error updating Pengajuan Baru", error });
  }
});

app.put("/pengajuanpembaharuan/:id", async (req, res) => {
  const { id } = req.params;
  const { status, pesanPenolakan } = req.body.data;

  console.log(status);
  try {
    // Validate that if status is "ditolak", pesanPenolakan is required
    if (status === "ditolak" && !pesanPenolakan) {
      return res.status(400).json({
        message: 'Pesan Penolakan is required when status is "ditolak"',
      });
    }

    // If status is "disetujui", we can clear the rejection message
    if (status === "disetujui") {
      // Optionally clear pesanPenolakan if approved
      pesanPenolakan = "";
    }
    const updatedPengajuan = await PengajuanPembaharuanModel.findByIdAndUpdate(id, {
      status: status,
      pesanPenolakan: "",
    });

    if (!updatedPengajuan) {
      return res.status(404).json({ message: "Pengajuan Baru not found" });
    }

    res.json(updatedPengajuan);
  } catch (error) {
    console.error("Error updating Pengajuan Baru:", error);
    res.status(500).json({ message: "Error updating Pengajuan Baru", error });
  }
});

const storagesertifikat = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/sertifikat"); // Folder tempat file disimpan
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Penamaan file
  },
});

const uploadsertifikat = multer({
  storage: storagesertifikat,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf","image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF yang diizinkan!"));
    }
  },
});

app.post(
  "/majelistaklim/upload-sertifikat/:id",
  uploadsertifikat.single("sertifikat"),
  async (req, res) => {
    try {
      const majelisId = req.params.id;

      // Cek apakah file tersedia
      if (!req.file) {
        return res.status(400).json({ message: "File sertifikat tidak ditemukan." });
      }

      // Perbarui data di database
      const updatedMajelis = await MajelisTaklimModel.findByIdAndUpdate(
        majelisId,
        { sertifikat: `/uploads/sertifikat/${req.file.filename}` }, // Simpan path file ke database
        { new: true }
      );

      if (!updatedMajelis) {
        return res.status(404).json({ message: "Majelis Taklim tidak ditemukan." });
      }

      res.status(200).json({
        message: "Sertifikat berhasil diunggah.",
        data: updatedMajelis,
      });
    } catch (error) {
      console.error("Error mengunggah sertifikat:", error);
      res.status(500).json({ message: "Terjadi kesalahan server." });
    }
  }
);

app.get('/download-sertifikat/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Cari data MajelisTaklim berdasarkan ID
    const majelisTaklim = await MajelisTaklimModel.findById(id);
    if (!majelisTaklim) {
      return res.status(404).json({ message: "Majelis Taklim tidak ditemukan!" });
    }

    // Pastikan sertifikat ada dan tentukan path untuk mendownload
    const sertifikatPath = majelisTaklim.sertifikat;
    if (!sertifikatPath) {
      return res.status(404).json({ message: "Sertifikat tidak ditemukan!" });
    }

    // Tentukan file path yang sesungguhnya di server
    const filePath = path.join(__dirname, 'uploads', 'sertifikat', path.basename(sertifikatPath));

    // Cek apakah file ada di server
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File sertifikat tidak ditemukan di server." });
    }

    // Tentukan header respons untuk download file
    res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Streaming file ke client untuk diunduh
    fs.createReadStream(filePath).pipe(res);

  } catch (error) {
    console.error("Error fetching sertifikat:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan saat mengunduh sertifikat!" });
  }
});

// Start the server
app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
