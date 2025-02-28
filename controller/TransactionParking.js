import moment from "moment";
import Transaction from "../model/TransactionParking.js";
import ParkingLocation from "../model/LocationParking.js";

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

    const location = await ParkingLocation.findOne({
      where: { LocationCode: locationCode },
    });
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    } // Ambil Tarif berdasarkan Jenis Kendaraan

    const transactions = await Transaction.findAll({
      where: { LocationName: location.LocationName },
    });
    res.json({
      status: true,
      message: "Transactions fetched successfully",
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
    const { FotoBuktiPembayaran } = req.body; // Hanya untuk OUT

    if (!FotoBuktiPembayaran) {
      return res
        .status(400)
        .json({ message: "FotoBuktiPembayaran is required" });
    }

    const transaction = await Transaction.findOne({
      where: { TransactionCode },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.Status === "OUT") {
      return res.status(400).json({ message: "Transaction already completed" });
    }

    const outTime = new Date();
    const inTime = new Date(transaction.InTime);
    const durationMinutes = Math.abs(outTime - inTime) / (1000 * 60);

    let finalTariff = transaction.Tariff;
    if (durationMinutes <= 5) {
      finalTariff = 0; // Gratis jika <= 5 menit
    }

    await transaction.update({
      OutTime: outTime,
      Tariff: finalTariff,
      Status: "OUT",
      FotoBuktiPembayaran, // Simpan bukti pembayaran
    });

    res.json({
      status: true,
      message: "Transaction updated to OUT",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

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
