import moment from "moment";
import Transaction from "../model/TransactionParking.js";
import ParkingLocation from "../model/LocationParking.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Buat folder jika belum ada
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Format: timestamp-random.ext
  },
});

const upload = multer({ storage });

const generateTransactionCode = (locationCode) => {
  const timestamp = moment().format("DDMMYYHHmmss");
  return `CAS-${timestamp}-${locationCode}`;
};

// Get All Transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};
export const getAllTransactionsByLocation = async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { page = 1, limit = 10 } = req.query; // Ambil page & limit dari query params

    const location = await ParkingLocation.findOne({
      where: { LocationCode: locationCode },
    });

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit); // Hitung offset berdasarkan halaman

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: { LocationName: location.LocationName },
      limit: parseInt(limit), // Jumlah data per halaman
      offset: offset, // Mulai dari data ke berapa
      order: [["updatedAt", "DESC"]], // Urutkan dari transaksi terbaru
    });

    res.json({
      status: true,
      message: "Transactions fetched successfully",
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalTransactions: count,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Get Transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};

// Create New Transaction
export const createTransaction = async (req, res) => {
  try {
    const { LocationCode, TypeVehicle } = req.body;
    console.log(req.body);
    if (!LocationCode || !TypeVehicle) {
      return res
        .status(400)
        .json({ message: "LocationCode and TypeVehicle are required" });
    }

    // Lookup ParkingLocation
    const location = await ParkingLocation.findOne({ where: { LocationCode } });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    } // Ambil Tarif berdasarkan Jenis Kendaraan
    let Tariff =
      TypeVehicle === "Mobil" ? location.TariffMobil : location.TariffMotor;

    // Generate Transaction Code
    const transactionCode = generateTransactionCode(LocationCode);

    // Create Transaction (tanpa FotoBuktiPembayaran)
    const transaction = await Transaction.create({
      TransactionCode: transactionCode,
      RefNumber: transactionCode,
      LocationName: location.LocationName,
      Vendor: location.Vendor,
      // Tariff,
      TypeVehicle,
      Status: "In",
      InTime: new Date(),
    });

    res.status(201).json({
      status: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

export const getTransactionDetail = async (req, res) => {
  try {
    const { TransactionCode } = req.params;

    const transaction = await Transaction.findOne({
      where: { TransactionCode },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const inTime = new Date(transaction.InTime);
    const outTime = new Date();
    const durationMinutes = Math.abs(outTime - inTime) / (1000 * 60);

    let finalTariff = transaction.Tariff;

    if (durationMinutes <= 5) {
      finalTariff = 0; // Gratis jika <= 5 menit
    } else {
      if (transaction.TypeVehicle === "Mobil") {
        finalTariff = 5000;
      } else {
        finalTariff = 2000;
      }
    }
    await transaction.update({
      Tariff: finalTariff,
    });

    res.json({
      status: true,
      message: "Transaction detail fetched successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction detail", error });
  }
};

// Update Transaction
export const updateTransactionStatus = async (req, res) => {
  try {
    const { TransactionCode } = req.params;

    // Pastikan ada file yang diupload
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Foto bukti pembayaran diperlukan" });
    }

    const transaction = await Transaction.findOne({
      where: { TransactionCode },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (transaction.Status === "OUT") {
      return res.status(400).json({ message: "Transaksi sudah selesai" });
    }

    const outTime = new Date();
    const inTime = new Date(transaction.InTime);
    const durationMinutes = Math.abs(outTime - inTime) / (1000 * 60);

    let finalTariff = transaction.Tariff;
    if (durationMinutes <= 5) {
      finalTariff = 0; // Gratis jika <= 5 menit
    } else {
      if (transaction.TypeVehicle === "Mobil") {
        finalTariff = 5000;
      } else {
        finalTariff = 2000;
      }
    }

    await transaction.update({
      OutTime: outTime,
      Tariff: finalTariff,
      Status: "Out",
      FotoBuktiPembayaran: req.file.path, // Simpan path gambar
    });

    res.json({
      status: true,
      message: "Transaksi berhasil diperbarui",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat update transaksi", error });
  }
};

export const uploadFotoBukti = upload.single("FotoBuktiPembayaran");

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    await transaction.destroy();
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
