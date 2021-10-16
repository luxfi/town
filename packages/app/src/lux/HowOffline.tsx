const HowOffline = ({ onClick }) => {
  return (
    <div>
      <h2 className="pb-6 text-xl">How do offline asks work?</h2>
      <p className="mb-10">
        An offline Ask will allow buyers to place a Bid without sending funds to the smart contract. The buyer will need
        to send you the funds directly as an "over the counter" deal. Example, they can send you a bank wire transfer.
      </p>
      <p className="mb-8">
        After you have verified receipt of the funds you can accept the bid. Accepting the offline bid will transfer
        ownership of the NFT to the buyer.
      </p>
      <button
        type="button"
        className="w-full px-4 py-3 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-offset-indigo-200 focus:outline-none focus:ring-offset-2 "
        onClick={onClick}
      >
        Ok
      </button>
    </div>
  )
}

export default HowOffline
