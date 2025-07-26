export const generateAlphanumericOtp = () => Math.random().toString(36).substring(2, 15);
