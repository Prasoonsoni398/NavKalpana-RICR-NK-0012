'use client';

import { useState } from 'react';
import { FaQuestionCircle, FaChalkboardTeacher } from 'react-icons/fa';

export default function LearningSupportPage() {
  const [activeTab, setActiveTab] = useState<
    'doubt' | 'backup' | 'myDoubts' | 'myBackup'
  >('doubt');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Learning Support
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b pb-3">
        <button
          onClick={() => setActiveTab('doubt')}
          className={`px-4 py-2 rounded ${
            activeTab === 'doubt'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          Submit Doubt
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded ${
            activeTab === 'backup'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          Request Backup
        </button>

        <button
          onClick={() => setActiveTab('myDoubts')}
          className={`px-4 py-2 rounded ${
            activeTab === 'myDoubts'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          My Doubts
        </button>

        <button
          onClick={() => setActiveTab('myBackup')}
          className={`px-4 py-2 rounded ${
            activeTab === 'myBackup'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200'
          }`}
        >
          My Backup Requests
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'doubt' && <SubmitDoubt />}
      {activeTab === 'backup' && <RequestBackup />}
      {activeTab === 'myDoubts' && <MyDoubts />}
      {activeTab === 'myBackup' && <MyBackupRequests />}
    </div>
  );
}