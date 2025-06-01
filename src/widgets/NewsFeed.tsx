import React, { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

// News data for mapping
const newsArticles = [
  {
    title: 'Aramco completes acquisition of 50% stake in Blue Hydrogen',
    titleColor: 'text-[#83bd01]',
    content:
      'Partnership aims to accelerate industrial carbon reduction and encourage growth of the hydrogen the economy of removing 12 tons of carbon dioxide per year from the atmosphere...',
    date: 'January 14, 2025',
  },
  {
    title:
      "Aramco launches Saudi Arabia's first CO2 Direct Air Capture test unit",
    titleColor: 'text-[#ffffff]',
    content:
      "Aramco, one of the world's leading integrated energy and chemicals companies, has launched the Kingdom's first CO2 Direct Air Capture (DAC) test unit, capable...",
    date: 'March 10, 2025',
  },
];

// Pagination dots data
const paginationDots = [
  { active: true, className: 'w-4 h-4 bg-[#83bd01] rounded-lg' },
  { active: false, className: 'w-2 h-2 bg-[#ffffff] rounded opacity-50' },
  { active: false, className: 'w-2 h-2 bg-[#ffffff] rounded opacity-50' },
  { active: false, className: 'w-2 h-2 bg-[#ffffff] rounded opacity-50' },
  { active: false, className: 'w-2 h-2 bg-[#ffffff] rounded opacity-50' },
];

export const NewsFeed = (): JSX.Element => {
  return (
    <section className="relative flex w-full flex-[0_0_auto] flex-col items-center gap-[27px]">
      <header className="relative flex w-full items-center">
        <Image
          src={`${process.env.NEXT_PUBLIC_BSP_NAME}/news-feed.svg`}
          alt="news-feed"
          width={100}
          height={100}
          className="h-[23px] w-[23px]"
        />

        <h2 className="ml-[11px] [font-family:'Ghawar-SmeiBold',Helvetica] text-xl leading-4 font-bold tracking-[-0.20px] whitespace-nowrap text-[#ffffff]">
          News Classifier
        </h2>

        <div
          className={`ml-[11px] h-px flex-grow bg-cover bg-no-repeat`}
          style={{
            backgroundImage: `${process.env.NEXT_PUBLIC_BSP_NAME}/line-136-4.svg`,
          }}
        ></div>
      </header>

      <Card className="bg-gradientblue-1 w-full rounded-xl border border-solid border-[#00a3e0] shadow-[3px_8px_30px_1px_#a8afb84c] [background:linear-gradient(180deg,rgba(30,58,113,1)_25%,rgba(0,128,189,1)_100%),linear-gradient(0deg,rgba(13,54,111,1)_0%,rgba(13,54,111,1)_100%)]">
        <CardContent className="p-[13px]">
          <div className="relative flex w-full items-center gap-6 px-4 py-0">
            {newsArticles.map((article, index) => (
              <React.Fragment key={index}>
                <div className="flex-1">
                  <div className="[font-family:'Ghawar-Bold',Helvetica] text-xl leading-5 font-normal tracking-[-0.40px] text-transparent">
                    <span
                      className={`font-bold ${article.titleColor} leading-[0.1px] tracking-[-0.08px]`}
                    >
                      {article.title}
                      <br />
                    </span>

                    <span className="[font-family:'Ghawar-Regular',Helvetica] text-base leading-[30px] tracking-[-0.05px] text-[#ffffff]">
                      {article.content.substring(0, 50)}
                    </span>

                    <span className="[font-family:'Ghawar-Regular',Helvetica] text-base leading-[22px] tracking-[-0.05px] text-[#ffffff]">
                      {article.content.substring(50)}
                    </span>
                  </div>

                  <div className="mt-4 [font-family:'Ghawar-Hefty',Helvetica] text-sm leading-[30px] font-normal tracking-[-0.28px] whitespace-nowrap text-[#dadce2]">
                    {article.date}
                  </div>
                </div>

                {index < newsArticles.length - 1 && (
                  <img
                    className="h-[81px] w-px"
                    alt="Line"
                    src={`${process.env.NEXT_PUBLIC_BSP_NAME}/line-55.svg`}
                  />
                )}
              </React.Fragment>
            ))}

            {/* Pagination dots */}
            <div className="relative h-4 w-20 rotate-90">
              <div className="relative inline-flex items-center gap-2">
                {paginationDots.map((dot, index) => (
                  <div key={index} className={dot.className} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default NewsFeed;
