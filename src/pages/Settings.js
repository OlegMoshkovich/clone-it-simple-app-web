import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Settings as SettingsIcon, User, Shield, Bell, Database, HardHat, Truck, Users } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'Team Management', icon: Users },
    { id: 'equipment', label: 'Equipment', icon: HardHat },
    { id: 'data', label: 'Data & Backup', icon: Database }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Site Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Construction Site Name
            </label>
            <input
              type="text"
              defaultValue="Downtown Office Complex"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Address
            </label>
            <input
              type="text"
              defaultValue="123 Main Street, Downtown, CA 90210"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Manager
            </label>
            <input
              type="text"
              defaultValue="John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="w-5 h-5 mr-2" />
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Commercial Building</option>
              <option>Residential Complex</option>
              <option>Infrastructure</option>
              <option>Renovation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Completion Date
            </label>
            <input
              type="date"
              defaultValue="2024-12-31"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSafetySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Safety Protocols
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Daily Safety Briefings</h4>
              <p className="text-sm text-gray-600">Require daily safety meetings</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Safety Equipment Checks</h4>
              <p className="text-sm text-gray-600">Daily equipment inspection logs</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Emergency Response Plan</h4>
              <p className="text-sm text-gray-600">Automated emergency notifications</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Officer
            </label>
            <input
              type="text"
              defaultValue="Mike Johnson"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              defaultValue="911"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Safety Alerts</h4>
              <p className="text-sm text-gray-600">Immediate notifications for safety issues</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Inspection Reminders</h4>
              <p className="text-sm text-gray-600">Daily inspection schedule reminders</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Equipment Maintenance</h4>
              <p className="text-sm text-gray-600">Equipment maintenance due dates</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Weather Alerts</h4>
              <p className="text-sm text-gray-600">Severe weather warnings</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Crew Members</h4>
              <p className="text-sm text-gray-600">Manage site personnel</p>
            </div>
            <Button variant="outline" size="sm">Manage Crew</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Contractors</h4>
              <p className="text-sm text-gray-600">External contractor access</p>
            </div>
            <Button variant="outline" size="sm">Manage Contractors</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Access Permissions</h4>
              <p className="text-sm text-gray-600">Role-based access control</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEquipmentSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardHat className="w-5 h-5 mr-2" />
            Equipment Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Equipment Inventory</h4>
              <p className="text-sm text-gray-600">Track all site equipment</p>
            </div>
            <Button variant="outline" size="sm">View Inventory</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Schedule</h4>
              <p className="text-sm text-gray-600">Equipment maintenance tracking</p>
            </div>
            <Button variant="outline" size="sm">Schedule</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Safety Equipment</h4>
              <p className="text-sm text-gray-600">PPE and safety gear tracking</p>
            </div>
            <Button variant="outline" size="sm">Track Equipment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data & Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Backup</h4>
              <p className="text-sm text-gray-600">Daily automatic data backup</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-gray-600">Download all construction logs</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Data Retention</h4>
              <p className="text-sm text-gray-600">Keep logs for 7 years</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'safety':
        return renderSafetySettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'users':
        return renderTeamSettings();
      case 'equipment':
        return renderEquipmentSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Site Settings</h1>
        <p className="text-gray-600">Configure your construction site management preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings; 