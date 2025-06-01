import React, { JSX } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface LoansAppTrayProps {
  menuItems?: {
    id: number;
    icon: string;
    label: string;
    count: number;
  }[];
  chartData?: {
    name: string;
    value: number;
    color: string;
  }[];
}

const LoansAppTray = ({
  menuItems = [
    {
      id: 1,
      icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/vector.svg`,
      label: 'Open PR',
      count: 13,
    },
    {
      id: 2,
      icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/group-1000003443.png`,
      label: 'Contract Expiring',
      count: 85,
    },
    {
      id: 3,
      icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/group-1000003444.png`,
      label: 'Pending SES',
      count: 32,
    },
    {
      id: 4,
      icon: `${process.env.NEXT_PUBLIC_BSP_NAME}/vector-1.svg`,
      label: 'Contract with 80%\nConsumed Values',
      count: 24,
    },
  ],
  chartData = [
    { name: 'PR', value: 86, color: '#449ca4' },
    { name: 'CE', value: 156, color: '#5899da' },
    { name: 'SES', value: 114, color: '#ffaa04' },
    { name: 'CV', value: 126, color: '#ff0000' },
  ],
}: LoansAppTrayProps): JSX.Element => {
  return (
    <div className="h-full w-full">
      <div className="h-full rounded-xl bg-gradient-to-b from-[#00214E] to-[#0164B0] p-4 text-white">
        <div className="flex h-full items-start gap-5">
          {/* Menu Section */}
          <div className="flex w-[350px] flex-col items-start gap-[5px]">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="relative flex h-[51px] w-full items-center gap-3 border-b [border-bottom-style:solid] border-[#ffffff20] px-4 py-2"
              >
                <img
                  className="relative h-[21.67px] w-[21.67px]"
                  alt={`Icon for ${item.label}`}
                  src={item.icon}
                />

                <div className="relative flex flex-1 grow flex-col items-start gap-0.5">
                  <div className="relative flex w-full flex-[0_0_auto] items-center gap-4 self-stretch">
                    <div className="relative mt-[-1.00px] flex-1 [font-family:'Ghawar-Hefty',Helvetica] text-base leading-5 font-normal tracking-[0] whitespace-pre-line text-white">
                      {item.label}
                    </div>
                  </div>
                </div>

                <div className="relative flex h-7 w-7 items-center justify-center gap-2.5 rounded-2xl bg-[#1E3A71] p-1">
                  <span className="relative w-fit [font-family:'Roboto',Helvetica] text-sm leading-[18px] font-semibold tracking-[0] whitespace-nowrap text-white">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="relative h-[200px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E3A71',
                    border: '1px solid #00a3e0',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Bar dataKey="value" radius={[20, 20, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansAppTray;
