const Bill = require('../models/Bill');

class BillService {
  async createBill(billData) {
    return await Bill.create(billData);
  }

  async getBillsBySocietyId(societyId, userRole, userId) {
    let query = { societyId };

    // If resident, only show their own bills
    if (userRole === 'Resident') {
      query.residentId = userId;
    }

    return await Bill.find(query).populate('residentId', 'name unitNumber');
  }

  async updateBill(billId, updateData, userRole, societyId, file) {
    let bill = await Bill.findById(billId);

    if (!bill) {
      const error = new Error('Bill not found');
      error.statusCode = 404;
      throw error;
    }

    if (bill.societyId.toString() !== societyId.toString()) {
      const error = new Error('Not authorized');
      error.statusCode = 403;
      throw error;
    }

    if (userRole === 'Resident') {
      // Resident can only upload receipt
      if (file) {
        updateData.paymentReceipt = file.path;
      }
      updateData.status = 'Paid'; // Simplified flow
      updateData.paymentDate = Date.now();
    } else {
      if (file) {
        updateData.paymentReceipt = file.path;
      }
    }

    bill = await Bill.findByIdAndUpdate(billId, updateData, {
      new: true,
      runValidators: true
    });

    return bill;
  }
}

module.exports = new BillService();
