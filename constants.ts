
import { Scenario, ScenarioType, MarketingVideo, Branch } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'coliving',
    type: ScenarioType.COLIVING,
    name: 'Women-only Coliving',
    color: '#8A6E99', // Purple
    description: 'A high-yield model converting units into 68 individual rooms with shared amenities, maximizing revenue per square meter.',
    
    financials: {
        worst: {
            revenue: 2213000,
            mathwaaShare: 442620,
            netIncome: 1770380,
            roi: 8.85
        },
        base: {
            revenue: 2459000,
            mathwaaShare: 491800,
            netIncome: 1967200,
            roi: 9.84
        },
        best: {
            revenue: 2704900,
            mathwaaShare: 540980,
            netIncome: 2163920,
            roi: 10.82
        }
    },

    propertyValue: 20000000,
    
    unitCount: 68,
    unitLabel: 'Rooms',
    occupancyDurationLabel: '10 Months Occupancy',
    
    unitMix: [
        { name: 'Normal Rooms', count: 45, avgPrice: 3260 },
        { name: 'Master Rooms', count: 9, avgPrice: 3933 },
        { name: 'Studios', count: 14, avgPrice: 4557 },
    ],
  },
  {
    id: 'private',
    type: ScenarioType.PRIVATE,
    name: 'Private Accommodation',
    color: '#2A5B64', // Teal
    description: 'A traditional residential model leasing 28 private apartments, offering stability and lower operational complexity.',
    
    financials: {
        worst: {
            revenue: 1910700,
            mathwaaShare: 382140,
            netIncome: 1528560,
            roi: 7.64
        },
        base: {
            revenue: 2123300,
            mathwaaShare: 424660,
            netIncome: 1698640,
            roi: 8.49
        },
        best: {
            revenue: 2335300,
            mathwaaShare: 467060,
            netIncome: 1868240,
            roi: 9.34
        }
    },

    propertyValue: 20000000,
    
    unitCount: 28,
    unitLabel: 'Apartments',
    occupancyDurationLabel: '10 Months Occupancy',
    
    unitMix: [
        { name: '4-Bedroom Apts', count: 12, avgPrice: 10842 },
        { name: '3-Bedroom Apts', count: 2, avgPrice: 9200 },
        { name: 'Studios', count: 14, avgPrice: 4557 },
    ],
  }
];

export const MARKETING_VIDEOS: MarketingVideo[] = [
    {
        id: 'v1',
        title: 'Coliving Concept Inspiration',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
        videoUrl: '#',
    },
    {
        id: 'v2',
        title: 'Private Living Standards',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        videoUrl: '#',
    }
];

export const MATHWAA_SHARE_PERCENTAGE = 0.20;
export const BRANCHES: Branch[] = []; 
