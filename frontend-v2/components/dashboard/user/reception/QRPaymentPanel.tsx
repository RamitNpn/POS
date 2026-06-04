export default function QRPaymentPanel({ amount }: any) {
  return (
    <div className="bg-[#262626] p-4 rounded-xl text-center">
      <p className="text-sm text-gray-400 mb-2">
        Scan to Pay (Demo QR)
      </p>

      <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
        <span className="text-black text-xs font-bold">
          QR CODE
        </span>
      </div>

      <p className="mt-2 text-yellow-400 font-semibold">
        ₹{amount}
      </p>
    </div>
  );
}