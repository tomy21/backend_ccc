import { DataTypes } from "sequelize";
import { dbUnikas } from "../config/dbConfig.js";

export const TransactionParkingIntegration = dbUnikas.define(
  "TransactionParkingIntegration",
  {
    Id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    TrxRefId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    TransactionNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ReferenceNo: {
      type: DataTypes.STRING(50),
    },
    LicensePlateIn: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    LocationCode: {
      type: DataTypes.STRING(50),
    },
    SubLocationCode: {
      type: DataTypes.STRING(50),
    },
    InTime: {
      type: DataTypes.DATE,
    },
    GateInCode: {
      type: DataTypes.STRING(50),
    },
    VehicleType: {
      type: DataTypes.STRING(50),
    },
    ProductName: {
      type: DataTypes.STRING(100),
    },
    GracePeriodIn: {
      type: DataTypes.INTEGER,
    },
    QRTicket: {
      type: DataTypes.STRING(200),
    },
    Duration: {
      type: DataTypes.INTEGER,
    },
    TariffAmount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    VoucherAmount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    PaymentAmount: {
      type: DataTypes.DECIMAL(12, 2),
    },
    PaymentStatus: {
      type: DataTypes.STRING(50),
    },
    PaymentDate: {
      type: DataTypes.DATE,
    },
    PaymentMethod: {
      type: DataTypes.STRING(50),
    },
    IssuerID: {
      type: DataTypes.STRING(50),
    },
    PaymentReferenceNo: {
      type: DataTypes.STRING(50),
    },
    RetrievalReferenceNo: {
      type: DataTypes.STRING(50),
    },
    PrepaidCardName: {
      type: DataTypes.STRING(50),
    },
    PrepaidCardNo: {
      type: DataTypes.STRING(50),
    },
    PrepaidCardMID: {
      type: DataTypes.STRING(50),
    },
    PrepaidCardTID: {
      type: DataTypes.STRING(50),
    },
    PrepaidCardInitialBalance: {
      type: DataTypes.DECIMAL(12, 2),
    },
    PrepaidCardRemainingBalance: {
      type: DataTypes.DECIMAL(12, 2),
    },
    ReferenceTransactionNo: {
      type: DataTypes.STRING(100),
    },
    GracePeriodPayment: {
      type: DataTypes.INTEGER,
    },
    LicensePlateOut: {
      type: DataTypes.STRING(50),
    },
    OutTime: {
      type: DataTypes.DATE,
    },
    GateOutCode: {
      type: DataTypes.STRING(50),
    },
    MerchantDataRequestIN: {
      type: DataTypes.TEXT,
    },
    MerchantDataResponseIN: {
      type: DataTypes.TEXT,
    },
    POSTDataRequestIN: {
      type: DataTypes.TEXT,
    },
    POSTDataResponseIN: {
      type: DataTypes.TEXT,
    },
    MerchantDataRequestPAY: {
      type: DataTypes.TEXT,
    },
    MerchantDataResponsePAY: {
      type: DataTypes.TEXT,
    },
    POSTDataRequestPAY: {
      type: DataTypes.TEXT,
    },
    POSTDataResponsePAY: {
      type: DataTypes.TEXT,
    },
    MerchantDataRequestOUT: {
      type: DataTypes.TEXT,
    },
    MerchantDataResponseOUT: {
      type: DataTypes.TEXT,
    },
    POSTDataRequestOUT: {
      type: DataTypes.TEXT,
    },
    POSTDataResponseOUT: {
      type: DataTypes.TEXT,
    },
    RecordStatus: {
      type: DataTypes.INTEGER,
    },
    CreatedBy: {
      type: DataTypes.STRING(100),
    },
    CreatedOn: {
      type: DataTypes.DATE,
    },
    UpdatedBy: {
      type: DataTypes.STRING(100),
    },
    UpdatedOn: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "TransactionParkingIntegration", // If you want to specify a table name
    timestamps: false, // Disable automatic createdAt and updatedAt fields
  }
);
