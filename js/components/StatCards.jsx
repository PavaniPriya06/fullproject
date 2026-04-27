import React from 'react';

/**
 * StatCard Component
 * Individual card displaying a metric
 */
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  const iconClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  return (
    <div className={`border-l-4 rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`text-4xl ${iconClasses[color]} opacity-60`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

/**
 * StatCards Component
 * Displays key metrics in a grid layout
 */
const StatCards = ({ totalRecords, approved, pending, rejected }) => {
  const stats = [
    {
      id: 'total',
      icon: '📊',
      label: 'Total Records',
      value: totalRecords,
      color: 'blue',
    },
    {
      id: 'approved',
      icon: '✓',
      label: 'Approved',
      value: approved,
      color: 'green',
    },
    {
      id: 'pending',
      icon: '⏱',
      label: 'Pending',
      value: pending,
      color: 'yellow',
    },
    {
      id: 'rejected',
      icon: '✕',
      label: 'Rejected',
      value: rejected,
      color: 'red',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatCards;
