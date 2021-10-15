const How = ({ onClick }) => {
  return (
    <div>
      <h2 className="pb-4 text-2xl">How do reservations work?</h2>
      <p className="mb-5">
        Reserve your NFT to ensure you are part of the LUX network at launch. If your bid is not accepted, your
        reservation will be refunded.
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

export default How
