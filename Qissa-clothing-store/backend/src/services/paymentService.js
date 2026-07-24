const generateTransactionId = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${random}`;
};

export const createMockSession = async ({ order, amount, currency }) => {
  const transactionId = generateTransactionId();

  return {
    success: true,
    transactionId,
    amount,
    currency,
    paymentMethod: "MockCard",
    paymentUrl: `/api/payments/mock/pay/${transactionId}`,
  };
};

export const confirmMockPayment = async ({ transactionId }) => {
  return {
    success: true,
    transactionId,
    status: "Success",
    gatewayResponse: {
      id: transactionId,
      status: "completed",
      message: "Payment processed successfully via mock gateway.",
    },
  };
};
