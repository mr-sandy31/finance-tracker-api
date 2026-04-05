import React, { useEffect, useState } from "react";

const BASE_URL = "https://finance-tracker-api-1-3ssk.onrender.com";

function App() {
  const [editId, setEditId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: "",
    date: "",
    notes: "",
  });

  const handleEdit = (txn) => {
  setForm({
    amount: txn.amount,
    type: txn.type,
    category: txn.category,
    date: txn.date,
    notes: txn.notes,
  });
  setEditId(txn.id);
};

  const fetchData = async () => {
    const res = await fetch(`${BASE_URL}/transactions/`);
    const data = await res.json();
    setTransactions(data);
  };

  const fetchSummary = async () => {
    const res = await fetch(`${BASE_URL}/analytics/summary`);
    const data = await res.json();
    setSummary(data);
  };

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = editId
    ? `${BASE_URL}/transactions/${editId}`
    : `${BASE_URL}/transactions/`;

  const method = editId ? "PUT" : "POST";

  await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...form,
      amount: Number(form.amount),
    }),
  });

    setForm({ amount: "", type: "income", category: "", date: "", notes: "" });
    fetchData();
    fetchSummary();
  };

  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    fetchData();
    fetchSummary();
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", background: "#f5f6fa" }}>
      <h1 style={{ textAlign: "center" }}>💰 Finance Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle("#4CAF50")}>
          <h3>Income</h3>
          <p>{summary.total_income}</p>
        </div>
        <div style={cardStyle("#f44336")}>
          <h3>Expense</h3>
          <p>{summary.total_expense}</p>
        </div>
        <div style={cardStyle("#2196F3")}>
          <h3>Balance</h3>
          <p>{summary.balance}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <input name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
       <button type="submit">
  {editId ? "Update" : "Add"}
</button>
      </form>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.amount}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>{t.date}</td>
              <td>{t.notes}</td>
              <td>
                 <button onClick={() => handleEdit(t)} style={editbtn} >Edit</button>
                <button onClick={() => handleDelete(t.id)} style={deleteBtn}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Styles
const cardStyle = (color) => ({
  flex: 1,
  padding: "20px",
  background: color,
  color: "#fff",
  borderRadius: "10px",
  textAlign: "center",
});

const formStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
};

const deleteBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px"
};

const editbtn = {
  background: "orange",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  cursor: "pointer",
  borderRadius: "5px",
  marginRight: "5px"
};

export default App;