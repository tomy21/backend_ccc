import { TransactionParkingIntegration } from "../model/TransactionParkingIntegration.js";

// Get transactions by LicensePlateIn
export const getByLicensePlateIn = async (req, res) => {
  const licensePlate = req.params.licensePlate;
  try {
    const transactions = await TransactionParkingIntegration.findAll({
      where: {
        LicensePlateIn: licensePlate,
      },
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the given license plate" });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all transactions with pagination (default limit of 5)
export const getAllTransactions = async (req, res) => {
  // Default limit and offset values
  let limit = parseInt(req.query.limit) || 5; // Default limit is 5
  let offset = parseInt(req.query.offset) || 0;

  console.log(`Limit: ${limit}, Offset: ${offset}`);

  try {
    const transactions = await TransactionParkingIntegration.findAll({
      limit: limit,
      offset: offset,
    });

    return res.status(200).json({
      data: transactions.rows,
      total: transactions.count,
      limit: limit,
      offset: offset,
    });
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
