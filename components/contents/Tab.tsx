import React, { useState, useRef, useEffect } from 'react';

interface TabProps {
    title: string;
    active: boolean;
    setActive: (index: number) => void;
    index: number;
    notification?: number;
}

const Tab: React.FC<TabProps> = ({ title, active, setActive, index, notification }) => {
    const labelRef = useRef<HTMLLabelElement>(null);
    const handleClick = () => {
        setActive(index);
    };

    return (
        <label
            ref={labelRef}
            className={`z-20 tab flex items-center justify-center text-xl font-semibold rounded-full cursor-pointer transition-colors ease-in ${active ? 'text-blue-600' : ''
                }`}
            onClick={handleClick}
        >
            {title}
            {notification && (
                <span
                    className={`notification flex items-center justify-center w-6 h-6 ml-3 rounded-full transition-all ease-in ${active ? 'bg-blue-600 text-white' : 'bg-blue-200'
                        }`}
                >
                    {notification}
                </span>
            )}
        </label>
    );
};

interface TabsProps {
    tabsData: Array<{
        title: string;
        notification?: number;
    }>;
    setActive: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabsData, setActive }) => {
    const [activeTab, setActiveTab] = useState<number>(1);
    const [tabSizes, setTabSizes] = useState<Array<{ width: number; height: number }>>([]);
    const tabsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (tabsRef.current) {
            const sizes = Array.from(tabsRef.current.children).map((tab) => {
                const { width, height } = (tab as HTMLElement).getBoundingClientRect();
                return { width, height };
            });
            setTabSizes(sizes);
        }
    }, []);

    useEffect(() => setActive(activeTab), [activeTab])

    return (
        <div className="container flex items-center justify-center mx-auto">
            <div className="relative flex p-3 tabs">
                <div className='flex' ref={tabsRef}>
                    {tabsData.map((tab, index) => (
                        <Tab
                            key={index}
                            title={tab.title}
                            active={activeTab === index + 1}
                            setActive={setActiveTab}
                            index={index + 1}
                            notification={tab.notification}
                        />
                    ))}
                </div>
                {tabSizes.length > 0 && (
                    <span
                        className="absolute z-10 transition-transform ease-out bg-blue-200 rounded-full"
                        style={{
                            width: tabSizes[activeTab - 1].width,
                            height: tabSizes[activeTab - 1].height,
                            transform: `translateX(${tabSizes
                                .slice(0, activeTab - 1)
                                .reduce((acc, curr) => acc + curr.width, 0)}px)`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Tabs;
