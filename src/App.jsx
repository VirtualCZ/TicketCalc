import React, { useState } from "react";
import "./App.css";
import "daisyui/dist/full.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
function App() {
  const [currency, setCurrency] = useState("CZK");
  const [ticketTypes, setTicketTypes] = useState([
    { type: "Adult", priceCZK: 200, priceEUR: 8 },
    { type: "Wheelchair", priceCZK: 150, priceEUR: 6 },
  ]);
  const [tickets, setTickets] = useState({});
  const [modalType, setModalType] = useState(null);
  const [currentTicket, setCurrentTicket] = useState({
    type: "",
    priceCZK: "",
    priceEUR: "",
  });
  const [amountReceived, setAmountReceived] = useState("");

  const handleTicketChange = (type, delta) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) + delta),
    }));
  };

  const handleAddOrEditTicketType = () => {
    if (modalType === "add") {
      setTicketTypes([...ticketTypes, currentTicket]);
    } else {
      setTicketTypes(
        ticketTypes.map((ticket) =>
          ticket.type === currentTicket.type ? currentTicket : ticket
        )
      );
    }
    setCurrentTicket({ type: "", priceCZK: "", priceEUR: "" });
    setModalType(null);
  };

  const handleDeleteTicketType = (type) => {
    setTicketTypes(ticketTypes.filter((ticket) => ticket.type !== type));
  };

  const openModal = (
    type,
    ticket = { type: "", priceCZK: "", priceEUR: "" }
  ) => {
    setCurrentTicket(ticket);
    setModalType(type);
  };

  const total = ticketTypes.reduce((sum, ticket) => {
    const count = tickets[ticket.type] || 0;
    const price = currency === "CZK" ? ticket.priceCZK : ticket.priceEUR;
    return sum + count * price;
  }, 0);

  const amountToGiveBack = amountReceived ? amountReceived - total : 0;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="">
          <label className="label">
            <span className="label-text">Select Currency</span>
          </label>
          <select
            className="select select-bordered w-full md:w-auto bg-neutral"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-col justify-between">
          <label className="label">
            <span className="label-text">Amount Received</span>
          </label>
          <input
            type="number"
            value={amountReceived}
            onChange={(e) => setAmountReceived(Number(e.target.value))}
            className="input input-bordered w-full md:w-auto bg-neutral"
            placeholder="Enter amount"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ticketTypes.map((ticket) => (
          <div
            key={ticket.type}
            className="card bg-neutral shadow-lg p-4 flex flex-row justify-between items-center md:mb-2"
          >
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-end">
                <h2 className="card-title">{ticket.type}</h2>
                <p className="md:ml-4">
                  Price:{" "}
                  {currency === "CZK" ? ticket.priceCZK : ticket.priceEUR}{" "}
                  {currency}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleTicketChange(ticket.type, -1)}
              >
                -
              </button>
              <span className="mx-2">{tickets[ticket.type] || 0}</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleTicketChange(ticket.type, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="md:grid md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">
            Total: {total.toFixed(2)} {currency}
          </h2>
          <h2 className="text-lg">
            {amountReceived &&
              `Amount to give back: ${amountToGiveBack.toFixed(2)} ${currency}`}
          </h2>
        </div>
        <button
          className="btn btn-error mt-4 w-full md:justify-self-end md:w-64 md:mt-0"
          onClick={() => setTickets({})}
        >
          Clear
        </button>
      </div>

      <div className="mt-2">
        <div className="collapse collapse-arrow border border-base-300 bg-neutral rounded-box">
          <input type="checkbox" />
          <div className="collapse-title text-lg font-medium">Ticket Types</div>
          <div className="collapse-content">
            {ticketTypes.map((ticket) => (
              <div
                key={ticket.type}
                className="flex flex-row justify-between items-start md:items-center mb-4 md:mb-2"
              >
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <span className="font-bold">{ticket.type}</span>
                    <span className="md:ml-4">
                      {ticket.priceCZK} CZK / {ticket.priceEUR} EUR
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-start md:items-center mt-2 md:mt-0">
                  <button
                    className="btn btn-sm btn-secondary mr-2 mb-2 md:mb-0"
                    onClick={() => openModal("edit", ticket)}
                  >
                    <EditOutlined />
                  </button>
                  <button
                    className="btn btn-sm btn-error mb-2 md:mb-0"
                    onClick={() => handleDeleteTicketType(ticket.type)}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center md:justify-center mt-4">
              <button
                className="btn btn-primary w-full md:w-auto"
                onClick={() => openModal("add")}
              >
                Add New Ticket Type
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {modalType === "add" ? "Add New Ticket Type" : "Edit Ticket Type"}
            </h3>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Ticket Type"
                value={currentTicket.type}
                onChange={(e) =>
                  setCurrentTicket({ ...currentTicket, type: e.target.value })
                }
                className="input input-bordered w-full mb-4 bg-neutral"
                disabled={modalType === "edit"}
              />
              <div className="flex mb-4">
                <input
                  type="number"
                  placeholder="Price in CZK"
                  value={currentTicket.priceCZK}
                  onChange={(e) =>
                    setCurrentTicket({
                      ...currentTicket,
                      priceCZK: e.target.value,
                    })
                  }
                  className="input input-bordered rounded-r-none flex-1 w-full bg-neutral"
                />
                <input
                  type="text"
                  value="CZK"
                  className="input input-bordered rounded-l-none bg-gray-200 text-gray-600 w-16 flex-none"
                  disabled
                />
              </div>
              <div className="flex mb-2">
                <input
                  type="number"
                  placeholder="Price in EUR"
                  value={currentTicket.priceEUR}
                  onChange={(e) =>
                    setCurrentTicket({
                      ...currentTicket,
                      priceEUR: e.target.value,
                    })
                  }
                  className="input input-bordered rounded-r-none flex-1 w-full bg-neutral"
                />
                <input
                  type="text"
                  value="EUR"
                  className="input input-bordered rounded-l-none bg-gray-200 text-gray-600 w-16 flex-none"
                  disabled
                />
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleAddOrEditTicketType}
              >
                Save
              </button>
              <button
                className="btn btn-neutral"
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
