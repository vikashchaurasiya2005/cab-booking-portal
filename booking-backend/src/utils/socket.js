// This module provides helper functions to emit booking/driver/vehicle/invoice events to vendors

export let ioInstance = null;

export function setSocketIO(io) {
  ioInstance = io;
}

export function emitToVendor(vendorId, event, data) {
  if (!ioInstance) return;
  ioInstance.to(`vendor_${vendorId}`).emit(event, data);
}

export function emitToAllVendors(event, data) {
  if (!ioInstance) return;
  ioInstance.to('vendors').emit(event, data);
}
