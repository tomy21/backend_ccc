import { Transaction } from "../../model/valet-self/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const {
      transactionNo,
      locationCode,
      locationName,
      plateNumber,
      vehicleType,
      inTime,
      tariffParking,
      tarifVip,
    } = req.body;

    const image = req.file;
    let imagePath = null;

    if (image) {
      imagePath = `/uploads/${image.filename}`; // untuk digunakan di frontend atau simpan path relatif
    }

    const data = await Transaction.create({
      transactionNo,
      locationCode,
      locationName,
      plateNumber,
      vehicleType,
      inTime,
      tariffParking,
      tarifVip,
      pathImage: imagePath,
    });

    const response = {
      statusCode: 201,
      message: "🎉 Data berhasil dibuat",
      data: data,
    };

    res.status(201).json(response);
  } catch (err) {
    res
      .status(400)
      .json({ message: "❌ Gagal membuat data", error: err.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const data = await Transaction.findAll();

    const response = {
      statusCode: 201,
      message: "🎉 Data berhasil di fetch",
      data: data,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil data", error: err.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const data = await Transaction.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    const response = {
      statusCode: 201,
      message: "🎉 Data berhasil dibuat",
      data: data,
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { Id: req.params.id },
    });
    if (!updated)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "✅ Update berhasil" });
  } catch (err) {
    res.status(400).json({ message: "Gagal update", error: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { Id: req.params.id },
    });
    if (!deleted)
      return res.status(404).json({ message: "Data tidak ditemukan" });
    res.json({ message: "🗑️ Data dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal hapus", error: err.message });
  }
};
