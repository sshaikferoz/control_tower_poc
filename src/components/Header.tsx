'use client';
import { Search } from 'lucide-react';
import SCMLogo from '@/assets/SCMLogo';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

import { Checkbox } from 'primereact/checkbox'; // Import Checkbox from PrimeReact

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded

  const handleCreateSection = () => {
    const randomId = Math.random().toString(36).substring(2, 10); // Generate random ID
    const encodedSectionName = encodeURIComponent(sectionName.trim());
    // Include the expanded state in the URL parameters
    window.window.location.href = `/mapping?sectionName=${encodedSectionName}&expanded=${isExpanded}`;
  };

  return (
    <nav className="m-4 flex h-[73px] w-[calc(100%-2rem)] items-center justify-between rounded-lg bg-gradient-to-r from-[#00214E] to-[#0164B0] p-4">
      <div className="flex items-center space-x-2">
        <div className="relative h-6 w-6">
          <SCMLogo />
        </div>
        <span className="text-xl font-semibold text-white">My SCM</span>
      </div>
      <div className="relative w-[546px]">
        <input
          type="text"
          placeholder="Search My Contract, Spend, Notification, Localization, KPI"
          className="h-[41px] w-full rounded-xl border border-white bg-white/20 px-4 pl-12 text-white placeholder-white focus:outline-none"
        />
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-white" />
      </div>
      <div>
        <Button
          label="Create Section"
          icon="pi pi-external-link"
          onClick={() => setVisible(true)}
        />
      </div>
      <Dialog
        header="Create Section"
        visible={visible}
        style={{ width: '30vw' }}
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-col gap-4">
          <div className="field">
            <label htmlFor="section-name" className="mb-2 block">
              Section Name
            </label>
            <InputText
              id="section-name"
              aria-describedby="section-name-help"
              className="w-full"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
            <small id="section-name-help" className="mt-1 block text-gray-500">
              Enter the section name
            </small>
          </div>

          <div className="field-checkbox flex items-center gap-2">
            <Checkbox
              inputId="expanded"
              checked={isExpanded}
              onChange={(e: any) => setIsExpanded(e.checked)}
            />
            <label htmlFor="expanded">Expanded by default</label>
          </div>

          <div className="mt-4">
            <Button
              label="Create Section"
              icon="pi pi-external-link"
              className="w-full"
              onClick={handleCreateSection}
            />
          </div>
        </div>
      </Dialog>
    </nav>
  );
};

export default Header;
