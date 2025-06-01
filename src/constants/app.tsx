import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { Report, MenuItem, IconOption } from '@/types/app';

// Icon options for reports
export const iconOptions: IconOption[] = [
  {
    name: 'AcademicCap',
    icon: <AcademicCapIcon className="h-5 w-5" />,
    component: AcademicCapIcon,
  },
  {
    name: 'DocumentText',
    icon: <DocumentTextIcon className="h-5 w-5" />,
    component: DocumentTextIcon,
  },
  {
    name: 'Clipboard',
    icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    component: ClipboardDocumentListIcon,
  },
  {
    name: 'Cube',
    icon: <CubeIcon className="h-5 w-5" />,
    component: CubeIcon,
  },
  {
    name: 'ChartBar',
    icon: <ChartBarIcon className="h-5 w-5" />,
    component: ChartBarIcon,
  },
];

// Initial report data
export const initialReportData: Record<string, Report[]> = {
  'B2B Reports': [
    {
      id: '1',
      title: 'B2B PO by Sourcing Report',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      category: 'B2B Reports',
    },
    {
      id: '2',
      title: 'Non Active Item Report',
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      category: 'B2B Reports',
    },
  ],
  'Inventory & Materials': [
    {
      id: '10',
      title: 'Listing of manufacturers',
      icon: <CubeIcon className="h-5 w-5" />,
      category: 'Inventory & Materials',
    },
    {
      id: '11',
      title: 'Inventory',
      icon: <CubeIcon className="h-5 w-5" />,
      category: 'Inventory & Materials',
    },
  ],
  'Process & Orders': [
    {
      id: '20',
      title: 'In process requisition details',
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      category: 'Process & Orders',
    },
  ],
};

// Initial menu items
export const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'My SCM',
    description: 'Supply Chain Management Dashboard',
    hidden: false,
    order: 0,
    type: 'Section',
  },
  {
    id: '2',
    name: 'B2B Reports',
    description: 'Manage and view your B2B reporting dashboard',
    hidden: false,
    order: 1,
    type: 'Section',
  },
  {
    id: '3',
    name: 'Inventory',
    description: 'Inventory management module',
    hidden: false,
    order: 2,
    type: 'Section',
  },
  {
    id: '4',
    name: 'Warehousing',
    description: 'Warehousing operations module',
    hidden: false,
    order: 3,
    type: 'Section',
  },
  {
    id: '5',
    name: 'Logistics',
    description: 'Logistics and transportation module',
    hidden: false,
    order: 4,
    type: 'Section',
  },
  {
    id: '6',
    name: 'Supplier Lifecycle',
    description: 'Supplier management module',
    hidden: false,
    order: 5,
    type: 'Section',
  },
  {
    id: '7',
    name: 'General Supply Chain',
    description: 'General supply chain operations',
    hidden: false,
    order: 6,
    type: 'Section',
  },
  {
    id: '8',
    name: 'Customers',
    description: 'Customer management module',
    hidden: false,
    order: 7,
    type: 'Section',
  },
];
