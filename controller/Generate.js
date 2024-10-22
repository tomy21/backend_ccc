import moment from "moment";
import { IssuesModel } from "../model/Issues.js";
import { Op } from "sequelize";

export const generateTicketNumber = async (lokasi) => {
  const datePart = moment().format("MMDDYY");
  const getInitials = (location) => {
    const words = location.split(" ");
    const initials = words.map((word) => word[0].toUpperCase());
    return initials.join("");
  };

  const initials = getInitials(lokasi);

  const count = await IssuesModel.count({
    where: {
      lokasi: lokasi,
      createdAt: {
        [Op.between]: [
          moment().startOf("day").toDate(),
          moment().endOf("day").toDate(),
        ],
      },
    },
  });

  const sequence = (count + 1).toString().padStart(3, "0");
  return `${datePart}${initials}${sequence}`;
};
