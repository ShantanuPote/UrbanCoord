export default function OfficerDashboard({ department }) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Officer Dashboard</h1>
        <p>Your Department: <strong>{department}</strong></p>
      </div>
    );
  }
  