import React, { useState, useEffect } from 'react';

// --- STYLES & FONTS ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Chakra+Petch:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

        .font-brutalist { font-family: 'Space Grotesk', sans-serif; }
        .font-modern { font-family: 'Inter', sans-serif; }
        .font-tech { font-family: 'Chakra Petch', sans-serif; }
        
        .fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .animate-level-up { animation: levelUp 0.5s ease-in-out; }
        @keyframes levelUp { 0% { transform: scale(1); } 50% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1); } }

        /* Brutalist Styles */
        .brutalist-shadow { box-shadow: 6px 6px 0px 0px rgba(0,0,0,1); }
        .brutalist-shadow-sm { box-shadow: 4px 4px 0px 0px rgba(0,0,0,1); }
        .brutalist-shadow-hover:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0px 0px rgba(0,0,0,1); }

        /* Marquee Animation */
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            position: relative;
        }
        .marquee-content {
            display: inline-block;
            animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
    `}</style>
);

// --- LOGIC ---
const apiKey = ""; 

const callGemini = async (prompt, type = 'general') => {
    if (!apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (type === 'repair') resolve(`• **Check Connectivity:** Ensure internal ribbon cables are seated correctly.\n• **Clean Contacts:** Use 99% Isopropyl alcohol on the board.\n• **Replacement:** Order a generic replacement part from AliExpress (£5).`);
                else if (type === 'profit') resolve(`• **Resale Value:** £65.00\n• **Repair Cost:** ~£12.50\n• **Potential Profit:** £52.50 (High Demand)`);
                else if (type === 'mod') resolve(`• **Shell Swap:** Transparent atomic purple shell.\n• **LED Kit:** Add RGB backlight behind the buttons.\n• **Battery Mod:** Upgrade to 2000mAh LiPo.`);
                else if (type === 'scavenge') resolve(`• **OLED Screen:** ~£40 (If undamaged)\n• **Battery:** ~£8\n• **Analog Sticks:** ~£5/pair\n• **Motherboard:** ~£20 (For chips)`);
                else if (type === 'description') resolve("It's broken, it's sad, and it needs a new dad. Previous owner raged too hard. Perfect project if you have patience and a screwdriver. Sold as-is, no crying allowed.");
                else if (type === 'price_suggestion') resolve("Based on the condition, a fair price is between £15 - £25.");
                else if (type === 'chat_draft') resolve("Hey! I'm interested. Would you consider £10 if I pick it up today?");
                else if (type === 'forum_draft') resolve("Title: Help diagnosing PS4 'Blue Light of Death'\n\nBody: I recently picked up a broken PS4. It pulses blue for a few seconds then turns off. I've tried swapping the HDD and power cable. Any advice on what to check next? Multimeter ready!");
                else if (type === 'scout_message') resolve("Hey there! I spotted your listing. I run BrokeyDokey, a marketplace for fixers. List it there for 0% fees!");
                else if (type === 'roast') resolve("This thing looks like it lost a fight with a lawnmower. The previous owner definitely rage-quit life, not just the game. Honestly, the landfill might reject this out of self-respect. Good luck, wizard.");
                else if (type === 'safety') resolve("⚠️ **AI Safety Warning:** You mentioned power input issues. Be extremely careful with the internal power supply unit (PSU). Capacitors can hold a lethal charge even when unplugged. Discharge them safely before touching the board.");
                else resolve("AI analysis complete.");
            }, 1000);
        });
    }
    return "AI Placeholder"; 
};

// --- ICONS ---
const Icon = ({ path, className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{path}</svg>;
const Icons = {
    Search: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Menu: (props) => <Icon {...props} path={<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>} />,
    Plus: (props) => <Icon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />,
    Wrench: (props) => <Icon {...props} path={<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>} />,
    ArrowLeft: (props) => <Icon {...props} path={<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>} />,
    Heart: (props) => <Icon {...props} path={<><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></>} />,
    MessageCircle: (props) => <Icon {...props} path={<><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>} />,
    AlertTriangle: (props) => <Icon {...props} path={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>} />,
    Sparkles: (props) => <Icon {...props} path={<><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></>} />,
    Loader2: (props) => <Icon {...props} path={<><path d="M21 12a9 9 0 1 1-6.219-8.56"/></>} />,
    Link: (props) => <Icon {...props} path={<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>} />,
    Upload: (props) => <Icon {...props} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />,
    X: (props) => <Icon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />,
    Bot: (props) => <Icon {...props} path={<><rect width="18" height="10" x="3" y="11" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></>} />,
    TrendingUp: (props) => <Icon {...props} path={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
    Palette: (props) => <Icon {...props} path={<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.01 17.461 2 12 2z"/></>} />,
    User: (props) => <Icon {...props} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
    CheckCircle: (props) => <Icon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />,
    Send: (props) => <Icon {...props} path={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>} />,
    SearchSmall: (props) => <Icon {...props} path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Users: (props) => <Icon {...props} path={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
    Trophy: (props) => <Icon {...props} path={<><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17"/><path d="M14 14.66V17"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>} />,
    ShoppingBag: (props) => <Icon {...props} path={<><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>} />,
    Ghost: (props) => <Icon {...props} path={<><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></>} />,
    Copy: (props) => <Icon {...props} path={<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>} />,
    Edit: (props) => <Icon {...props} path={<><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>} />,
    Save: (props) => <Icon {...props} path={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />,
    Briefcase: (props) => <Icon {...props} path={<><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>} />,
    Dollar: (props) => <Icon {...props} path={<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>} />,
    Megaphone: (props) => <Icon {...props} path={<><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>} />,
    Tag: (props) => <Icon {...props} path={<><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>} />,
    Target: (props) => <Icon {...props} path={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
    Shield: (props) => <Icon {...props} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>} />,
    Camera: (props) => <Icon {...props} path={<><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></>} />,
    Recycle: (props) => <Icon {...props} path={<><polyline points="7 19 7 9 17 19 17 9"/><path d="M22 12c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z"/></>} />,
    Zap: (props) => <Icon {...props} path={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>} />,
    MapPin: (props) => <Icon {...props} path={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />,
    Star: (props) => <Icon {...props} path={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} />,
    Leaf: (props) => <Icon {...props} path={<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></>} />,
    Gift: (props) => <Icon {...props} path={<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></>} />,
    Building: (props) => <Icon {...props} path={<><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>} />,
    Share: (props) => <Icon {...props} path={<><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></>} />,
    Tv: (props) => <Icon {...props} path={<><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></>} />,
    Smartphone: (props) => <Icon {...props} path={<><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>} />,
    Handshake: (props) => <Icon {...props} path={<><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-1.42-1.42l4-4a1 1 0 0 1 1.41 0l2.17 2.17a3 3 0 0 0 4.24 0l2.17-2.17a1 1 0 0 1 1.41 0l4 4a1 1 0 1 1-1.42 1.42l-.88.88a3 3 0 0 0 0 4.24l3.88 3.88a1 1 0 1 0 3-3L24 22l-2-2"/></>} />,
    PieChart: (props) => <Icon {...props} path={<><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>} />,
    BarChart: (props) => <Icon {...props} path={<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>} />
};

// --- 3. DATA CONSTANTS ---
const CATEGORIES = ["Consoles", "Phones & Tablets", "Laptops", "PC Components", "Audio", "Cameras", "Retro Games", "VR Headsets", "Drones"];
const CATEGORY_WEIGHTS = { 
    "Consoles": 3.5, 
    "Phones & Tablets": 0.2, 
    "Laptops": 2.0, 
    "PC Components": 1.0, 
    "Audio": 0.5, 
    "Cameras": 0.8,
    "Retro Games": 0.2, 
    "VR Headsets": 0.8, 
    "Drones": 1.5,
    "Handhelds": 0.5
};
const SHIPPING_RATES = { base: 2.99, perKg: 1.50 };

const MOCK_LISTINGS = [
    { id: '1', title: 'NINTENDO SWITCH LITE - DRIFT GOD', price: 45.00, image: 'https://images.unsplash.com/photo-1578303512597-81de837554e2?auto=format&fit=crop&q=80&w=600', difficulty: 'Easy', condition: 'Drift', category: 'Handhelds', description: "Left stick has a mind of its own.", seller: "RetroRick", location: "Manchester, UK", sellerRating: 4.8, reviews: 124 },
    { id: '2', title: 'MacBook Pro 2015 - Screen Glitch', price: 120.00, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=600', difficulty: 'Expert', condition: 'Screen Fault', category: 'Laptops', description: "Screen flickers purple. HDMI out works fine. No SSD.", seller: "BigDave88", location: "London, UK", sellerRating: 4.2, reviews: 15 },
    { id: '3', title: 'RTX 3080 - ARTIFACT CITY', price: 150.00, image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600', difficulty: 'Expert', condition: 'Overheating', category: 'PC Components', description: "Shows space invaders.", seller: "MinerMike", location: "Birmingham, UK", sellerRating: 5.0, reviews: 4 },
];

const INITIAL_ADS = [
    { id: 'ad1', type: 'ad', title: 'iFixit Pro Tech Toolkit', price: '59.99', image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600', difficulty: 'Tool', condition: 'New', category: 'Tools', description: 'Everything you need to fix your gear.', seller: 'iFixit (Sponsored)', status: 'Active', budget: 500, spent: 124.50, impressions: 4520, clicks: 142, ctr: '3.1%', location: "Global Shipping", sellerRating: 4.9, reviews: 5200 },
];

const MOCK_FORUM_THREADS = [
    { id: 1, title: "PS5 HDMI Port Replacement", author: "SolderingNoob", replies: 12, category: "Repair Help", views: 340, content: "I've ripped the pads off my PS5 HDMI port." },
    { id: 2, title: "GameBoy restoration!", author: "RetroKing", replies: 45, category: "Showcase", views: 1200, content: "Found this in a muddy puddle." },
];

const INITIAL_BOUNTIES = [
    { id: 'b1', brand: 'Apple', title: 'iPhone 12 Rescue', reward: '£5 Credit', desc: 'Fix iPhone 12 devices.', logo: '🍎', color: 'bg-gray-100', expires: '28 days' },
    { id: 'b2', brand: 'Samsung', title: 'Galaxy S21 Screen', reward: '£10 Credit', desc: 'Harvest working screens.', logo: 'S', color: 'bg-blue-50', expires: '14 days' },
];

const MOCK_SCOUT_RESULTS = [
    { id: 'e1', title: 'PS4 PRO - FAULTY DISK DRIVE', price: '45.00', listed: '28 days ago', profit: '£60', link: 'ebay.com/itm/123' },
    { id: 'e2', title: 'Nintendo Switch Lite - No Power', price: '30.00', listed: '15 days ago', profit: '£45', link: 'ebay.com/itm/456' },
];

const MOCK_REWARDS = [
     { id: 'r1', title: 'Back Market Voucher', cost: 100, icon: <Icons.Recycle className="w-5 h-5"/>, desc: '£20 Towards Refurb Tech', partner: 'Back Market' },
     { id: 'r2', title: 'Currys Trade-In Boost', cost: 50, icon: <Icons.Zap className="w-5 h-5"/>, desc: '+10% Value on Trade-ins', partner: 'Currys' },
     { id: 'r3', title: 'Patagonia Repair', cost: 50, icon: <Icons.Leaf className="w-5 h-5"/>, desc: '£15 Off Worn Wear Repairs', partner: 'Patagonia' },
     { id: 'r4', title: 'Listing Boost', cost: 10, icon: <Icons.TrendingUp className="w-5 h-5"/>, desc: 'Push your items to top.', partner: 'BrokeyDokey' }
];

const TRADE_OFFERS = [
    { id: 't1', partner: 'Back Market', amount: 20, desc: 'Credit for any refurb phone', icon: <Icons.Recycle className="w-4 h-4"/>, color: 'bg-green-100' },
    { id: 't2', partner: 'Currys', amount: 15, desc: 'In-store tech voucher', icon: <Icons.Zap className="w-4 h-4"/>, color: 'bg-purple-100' },
    { id: 't3', partner: 'Patagonia', amount: 25, desc: 'Worn Wear credit', icon: <Icons.Leaf className="w-4 h-4"/>, color: 'bg-orange-100' },
];

const MOCK_LEADERBOARD_INDIVIDUAL = [
     { rank: 1, name: "RepairWizard", score: 840.5, tag: "Master Technician" },
     { rank: 2, name: "CircuitBreaker", score: 620.2, tag: "Repair God" },
     { rank: 3, name: "ScrapMaster (You)", score: 12.5, tag: "Landfill Lurker" }, 
     { rank: 4, name: "NoSolderNoCry", score: 125.0, tag: "Soldering Sage" },
     { rank: 5, name: "RefurbRick", score: 98.4, tag: "Component Collector" }
];

const MOCK_LEADERBOARD_CORP = [
    { rank: 1, name: "TechCorp Inc", score: 5400.2, tag: "Platinum Partner" },
    { rank: 2, name: "GreenSchool Ltd", score: 2100.5, tag: "Gold Partner" },
    { rank: 3, name: "City Council IT", score: 1800.0, tag: "Silver Partner" },
];

// --- 4. SHARED COMPONENTS ---
const Toast = ({ message, onClose }) => (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#facc15] flex items-center gap-3 z-50 animate-level-up rounded-lg">
        <Icons.CheckCircle className="w-5 h-5 text-yellow-400" />
        <span className="font-bold uppercase tracking-wider text-sm">{message}</span>
    </div>
);

// Define ThemedButton explicitly before other components use it
const ThemedButton = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false, theme = 'brutalist' }) => {
    const isModern = theme === 'modern';
    const baseStyles = isModern 
        ? "font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 rounded-full"
        : "font-bold uppercase border-2 border-black transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 rounded-lg";
    const variants = {
        primary: isModern ? "bg-black text-white hover:bg-gray-800 shadow-md px-6 py-2" : "bg-yellow-400 hover:bg-yellow-300 text-black brutalist-shadow-sm px-4 py-2",
        secondary: isModern ? "bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm px-6 py-2" : "bg-white hover:bg-gray-50 text-black brutalist-shadow-sm px-4 py-2",
        black: isModern ? "bg-black text-white hover:bg-gray-800 shadow-lg px-6 py-3" : "bg-black text-white hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] px-4 py-2",
        purple: isModern ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md px-4 py-2" : "bg-purple-200 hover:bg-purple-300 text-purple-900 border-purple-900 brutalist-shadow-sm px-4 py-2",
        blue: isModern ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md px-4 py-2" : "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-900 brutalist-shadow-sm px-4 py-2",
        green: isModern ? "bg-green-500 text-white hover:bg-green-600 shadow-md px-4 py-2" : "bg-green-300 hover:bg-green-400 text-black border-black brutalist-shadow-sm px-4 py-2",
        orange: isModern ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md px-4 py-2" : "bg-orange-100 hover:bg-orange-200 text-orange-900 border-orange-900 brutalist-shadow-sm px-4 py-2",
        pink: isModern ? "bg-pink-500 text-white hover:bg-pink-600 shadow-md px-4 py-2" : "bg-pink-100 hover:bg-pink-200 text-pink-900 border-pink-900 brutalist-shadow-sm px-4 py-2",
        red: isModern ? "bg-red-500 text-white hover:bg-red-600 shadow-md px-4 py-2" : "bg-red-200 hover:bg-red-300 text-red-900 border-red-900 brutalist-shadow-sm px-4 py-2",
        ghost: isModern ? "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black" : "bg-transparent border-none shadow-none hover:bg-gray-200"
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
};

const BrutalistButton = (props) => <ThemedButton {...props} theme="brutalist" />;

const Tag = ({ children, color = 'bg-white', theme = 'brutalist' }) => {
    const isModern = theme === 'modern';
    const style = isModern 
        ? `px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`
        : `${color} border-2 border-black px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md`;
    return <span className={style}>{children}</span>;
};

// --- 5. SUB-COMPONENTS ---
const Marquee = ({ theme }) => {
    if (theme === 'modern') return null;
    return (
        <div className="bg-yellow-400 border-b-2 border-black py-2 marquee-container font-mono text-sm font-bold">
            <div className="marquee-content">
                REPAIR • REUSE • RESCUE • DON'T BIN IT • BANK IT • BROKEYDOKEY • SAVE THE PLANET • EARN CASH • REPAIR • REUSE • RESCUE • DON'T BIN IT • BANK IT • BROKEYDOKEY • SAVE THE PLANET • EARN CASH •
            </div>
        </div>
    );
};

const Hero = ({ theme, onViewChange }) => {
    const isModern = theme === 'modern';
    return (
        <div className={`mb-12 fade-in ${isModern ? 'text-center' : ''}`}>
            <div className={`${isModern ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl shadow-xl p-12' : 'bg-[#ff90e8] border-4 border-black p-8 brutalist-shadow rounded-xl'} relative overflow-hidden`}>
                 <div className="relative z-10">
                    <h1 className={`text-5xl md:text-7xl mb-4 ${isModern ? 'font-bold tracking-tight' : 'font-black uppercase italic leading-[0.9]'}`}>
                        Don't Bin It. <br/><span className={isModern ? 'text-yellow-300' : 'text-white text-stroke-black'}>Bank It.</span>
                    </h1>
                    <p className={`text-xl max-w-lg mb-8 ${isModern ? 'mx-auto opacity-90' : 'font-bold border-l-4 border-black pl-4'}`}>
                        The marketplace for broken tech. Turn your electronic junk into cash, spare parts, and planet-saving points.
                    </p>
                    <div className={`flex gap-4 ${isModern ? 'justify-center' : ''}`}>
                        <ThemedButton theme={theme} variant={isModern ? 'secondary' : 'black'} onClick={() => onViewChange('sell')} className="text-lg px-8">Start Selling</ThemedButton>
                        <ThemedButton theme={theme} variant={isModern ? 'primary' : 'secondary'} onClick={() => onViewChange('feed')} className="text-lg px-8">Explore Parts</ThemedButton>
                    </div>
                </div>
                {!isModern && (
                    <>
                        <div className="absolute top-4 right-4 rotate-12">
                            <div className="bg-white border-2 border-black p-2 font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                                0% Fees for Sellers
                            </div>
                        </div>
                        <div className="absolute -bottom-12 -right-12 text-9xl opacity-10 pointer-events-none">
                            <Icons.Wrench className="w-64 h-64" />
                        </div>
                    </>
                )}
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                    { icon: <Icons.Camera className="w-8 h-8"/>, title: "1. Snap It", desc: "Upload a photo of your broken gear. AI writes the description." },
                    { icon: <Icons.Bot className="w-8 h-8"/>, title: "2. AI Scan", desc: "Our bot estimates value & repair difficulty instantly." },
                    { icon: <Icons.Dollar className="w-8 h-8"/>, title: "3. Get Paid", desc: "Sell to a fixer or trade-in for instant credit." }
                ].map((step, i) => (
                    <div key={i} className={`p-6 ${isModern ? 'bg-white rounded-xl shadow-sm border border-gray-100' : 'bg-white border-2 border-black brutalist-shadow-sm rounded-xl'}`}>
                        <div className={`mb-4 w-12 h-12 flex items-center justify-center ${isModern ? 'bg-blue-50 text-blue-600 rounded-full' : 'bg-black text-white border-2 border-black rounded-lg'}`}>{step.icon}</div>
                        <h3 className={`text-xl mb-2 ${isModern ? 'font-bold' : 'font-black uppercase'}`}>{step.title}</h3>
                        <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 7. ImpactDashboard
const ImpactDashboard = ({ theme, totalSaved }) => {
    const isModern = theme === 'modern';
    return (
         <div className={`p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 ${isModern ? 'bg-green-900 text-white rounded-2xl shadow-lg' : 'bg-green-400 border-4 border-black brutalist-shadow rounded-xl'}`}>
            <div className="flex items-center gap-6">
                <div className={`p-4 ${isModern ? 'bg-white/10 rounded-full' : 'bg-white border-2 border-black rounded-lg'}`}>
                    <Icons.Recycle className={`w-12 h-12 ${isModern ? 'text-white' : 'text-black'}`} />
                </div>
                <div>
                    <div className={`text-4xl ${isModern ? 'font-bold' : 'font-black font-tech'}`}>{totalSaved.toLocaleString()}kg</div>
                    <div className="font-bold uppercase tracking-widest text-sm opacity-80">E-Waste Diverted</div>
                </div>
            </div>
            <div className="h-12 w-px bg-current opacity-20 hidden md:block"></div>
            <div className="flex items-center gap-6">
                <div>
                    <div className={`text-4xl ${isModern ? 'font-bold' : 'font-black font-tech'}`}>£42.5k</div>
                    <div className="font-bold uppercase tracking-widest text-sm opacity-80">Paid to Sellers</div>
                </div>
                 <div className={`p-4 ${isModern ? 'bg-white/10 rounded-full' : 'bg-white border-2 border-black rounded-lg'}`}>
                    <Icons.Zap className={`w-12 h-12 ${isModern ? 'text-white' : 'text-black'}`} />
                </div>
            </div>
        </div>
    );
};

// 8. AuthView
const AuthView = ({ onLogin, onSignup, theme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', handle: '', email: '', password: '', type: 'user' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(formData);
        } else {
            if (!formData.name || !formData.email || !formData.password) return alert("Please fill all fields");
            onSignup(formData);
        }
    };

    const isModern = theme === 'modern';

    return (
        <div className={`flex items-center justify-center min-h-[80vh] fade-in ${isModern ? 'font-modern' : ''}`}>
            <div className={`max-w-md w-full p-8 ${isModern ? 'bg-white rounded-2xl shadow-xl border border-gray-100' : 'bg-white border-4 border-black brutalist-shadow rounded-xl'}`}>
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className={`p-4 bg-black text-white ${isModern ? 'rounded-xl' : 'rounded-lg'}`}>
                            <Icons.Wrench className="w-10 h-10" />
                        </div>
                    </div>
                    <h1 className={`text-3xl ${isModern ? 'font-bold' : 'font-black uppercase italic'}`}>
                        {isLogin ? 'Welcome Back' : 'Join the Scrapyard'}
                    </h1>
                    <p className="text-gray-500 mt-2">The marketplace for broken tech.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`}
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Handle (@username)" 
                                className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`}
                                value={formData.handle}
                                onChange={e => setFormData({...formData, handle: e.target.value})}
                            />
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'user'})}
                                    className={`flex-1 p-2 text-sm font-bold ${formData.type === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'} ${isModern ? 'rounded-lg' : 'border-2 border-black rounded-lg'}`}
                                >
                                    Fixer (User)
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'business'})}
                                    className={`flex-1 p-2 text-sm font-bold ${formData.type === 'business' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'} ${isModern ? 'rounded-lg' : 'border-2 border-black rounded-lg'}`}
                                >
                                    Business
                                </button>
                            </div>
                        </>
                    )}
                    
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className={`w-full p-3 ${isModern ? 'rounded-lg border border-gray-300' : 'border-2 border-black font-bold rounded-lg'}`}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />

                    {isLogin && (
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <input 
                                type="checkbox" 
                                id="bizLogin" 
                                checked={formData.type === 'business'} 
                                onChange={(e) => setFormData({...formData, type: e.target.checked ? 'business' : 'user'})}
                            />
                            <label htmlFor="bizLogin">Login as Business Account</label>
                        </div>
                    )}

                    <ThemedButton theme={theme} type="submit" variant="black" className="w-full py-3 text-lg">
                        {isLogin ? 'Log In' : 'Create Account'}
                    </ThemedButton>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold underline hover:text-blue-600">
                        {isLogin ? "New here? Create an account" : "Already have an account? Log in"}
                    </button>
                </div>
                
                {isLogin && (
                     <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-xs text-gray-400 font-bold uppercase text-center mb-2">Dev Tools</div>
                        <ThemedButton theme={theme} variant="secondary" className="w-full text-xs" onClick={() => onLogin({ email: 'demo', type: 'user' })}>
                            ⚡ Quick Login as Demo User
                        </ThemedButton>
                     </div>
                )}
            </div>
        </div>
    );
};

// 9. BusinessDashboard
const BusinessDashboard = ({ onCreateBounty, onCreateAd, activeAds, theme }) => {
    const [campaignType, setCampaignType] = useState('bounty');
    const [bountyForm, setBountyForm] = useState({ title: '', reward: '', desc: '', brand: '' });
    const [adForm, setAdForm] = useState({ title: '', price: '', desc: '', link: '', budget: '' });
    const [sniperForm, setSniperForm] = useState({ keywords: '', maxPrice: '', quantity: '' });
    const [adImages, setAdImages] = useState([]);

    const handleAdImageChange = (e) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
            setAdImages(prev => [...prev, ...newImages]);
        }
    };
     const removeAdImage = (index) => { setAdImages(prev => prev.filter((_, i) => i !== index)); };

    const handleLaunch = () => {
        if (campaignType === 'bounty') {
            onCreateBounty(bountyForm);
            setBountyForm({ title: '', reward: '', desc: '', brand: '' });
            alert("Bounty Campaign Launched! 🚀");
        } else if (campaignType === 'ad') {
            if(!adForm.budget) return alert("Please set a daily budget.");
            const finalImage = adImages.length > 0 ? adImages[0] : 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600';
            
            // FIX: Create a complete Ad object with correct type and metadata
            const newAd = {
                id: `ad-${Date.now()}`,
                type: 'ad', // Critical for ListingCard to render correctly
                title: adForm.title,
                price: adForm.price,
                description: adForm.desc,
                image: finalImage,
                seller: 'Your Business (Sponsored)',
                category: 'Tools', // Default category for ads to ensure they show
                difficulty: 'Tool',
                condition: 'New',
                status: 'Active',
                budget: adForm.budget,
                spent: 0,
                impressions: 0,
                clicks: 0,
                ctr: '0%'
            };

            onCreateAd(newAd);
            setAdForm({ title: '', price: '', desc: '', link: '', budget: '' });
            setAdImages([]);
            alert("Sponsored Ad Live! 📢");
        } else if (campaignType === 'sniper') {
            alert(`Sniper Active!`);
            setSniperForm({ keywords: '', maxPrice: '', quantity: '' });
        }
    };

    return (
        <div className={`max-w-5xl mx-auto p-4 fade-in space-y-6 ${theme === 'modern' ? 'font-modern' : ''}`}>
            <div className={`bg-blue-900 text-white p-8 ${theme === 'modern' ? 'rounded-2xl shadow-xl' : 'border-4 border-black brutalist-shadow rounded-xl'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black uppercase italic mb-2">Pro Partner Portal</h1>
                        <p className="font-mono opacity-80">Manage campaigns, track impact, and sponsor repairs.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs uppercase opacity-70">Wallet Balance</div>
                        <div className="text-3xl font-mono font-bold">£3,450.00</div>
                    </div>
                </div>
            </div>

            {/* Stats & Table */}
            <div className="grid md:grid-cols-3 gap-6">
                {['Total Ad Spend: £124.50', 'Total Impressions: 4,520', 'Avg. CPC: £0.87'].map((stat, i) => (
                    <div key={i} className={`bg-white p-6 ${theme === 'modern' ? 'rounded-xl shadow-sm border border-gray-100' : 'border-2 border-black brutalist-shadow-sm rounded-xl'}`}>
                        <div className="text-sm font-bold text-gray-500 uppercase">{stat.split(':')[0]}</div><div className="text-4xl font-black text-blue-600">{stat.split(':')[1]}</div>
                    </div>
                ))}
            </div>
            
            {/* Live Campaigns Table */}
            <div className="bg-white border-2 border-black p-6 rounded-xl">
                 <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Icons.TrendingUp className="w-5 h-5"/> Live Ad Campaigns</h3>
                <div className="overflow-x-auto"><table className="w-full text-left font-mono text-sm"><thead className="bg-gray-100 border-b-2 border-black"><tr><th className="p-3">Campaign</th><th className="p-3">Status</th><th className="p-3">Budget/Day</th><th className="p-3">Spent</th><th className="p-3">Impressions</th><th className="p-3">Clicks</th><th className="p-3">CTR</th></tr></thead><tbody className="divide-y divide-gray-200">{activeAds.map(ad => (<tr key={ad.id}><td className="p-3 font-bold">{ad.title}</td><td className="p-3"><Tag color="bg-green-200">{ad.status}</Tag></td><td className="p-3">£{ad.budget}</td><td className="p-3">£{ad.spent}</td><td className="p-3">{ad.impressions}</td><td className="p-3">{ad.clicks}</td><td className="p-3 text-blue-600 font-bold">{ad.ctr}</td></tr>))}</tbody></table></div>
            </div>

            <div className={`bg-white p-6 ${theme === 'modern' ? 'rounded-xl shadow-sm border border-gray-100' : 'border-2 border-black rounded-xl'}`}>
                <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2"><Icons.Megaphone className="w-6 h-6"/> Launch New Campaign</h3>
                
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setCampaignType('bounty')} className={`flex-1 p-3 border-2 border-black font-bold uppercase rounded-lg ${campaignType === 'bounty' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <div className="flex items-center justify-center gap-2"><Icons.Wrench className="w-4 h-4"/> Repair Bounty</div>
                    </button>
                    <button onClick={() => setCampaignType('ad')} className={`flex-1 p-3 border-2 border-black font-bold uppercase rounded-lg ${campaignType === 'ad' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <div className="flex items-center justify-center gap-2"><Icons.Tag className="w-4 h-4"/> Sell Tools (Ad)</div>
                    </button>
                    <button onClick={() => setCampaignType('sniper')} className={`flex-1 p-3 border-2 border-black font-bold uppercase rounded-lg ${campaignType === 'sniper' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <div className="flex items-center justify-center gap-2"><Icons.Target className="w-4 h-4"/> Buy Inventory</div>
                    </button>
                </div>

                {/* BOUNTY FORM */}
                {campaignType === 'bounty' && (
                    <div className="space-y-4 max-w-lg animate-in fade-in">
                        <div className="text-sm font-mono text-gray-500 mb-2">Target: Repair Enthusiasts • Goal: Carbon Credits</div>
                        <input 
                            placeholder="Campaign Title (e.g., Fix 50 iPhones)" 
                            className="w-full p-3 border-2 border-black font-bold rounded-lg"
                            value={bountyForm.title} onChange={e => setBountyForm({...bountyForm, title: e.target.value})}
                        />
                        <input 
                            placeholder="Brand Name" 
                            className="w-full p-3 border-2 border-black font-bold rounded-lg"
                            value={bountyForm.brand} onChange={e => setBountyForm({...bountyForm, brand: e.target.value})}
                        />
                        <div className="flex gap-4">
                            <input 
                                placeholder="Reward (e.g. £5)" 
                                className="w-1/2 p-3 border-2 border-black font-bold rounded-lg"
                                value={bountyForm.reward} onChange={e => setBountyForm({...bountyForm, reward: e.target.value})}
                            />
                            <div className="flex items-center gap-2 font-bold text-gray-500">
                                <Icons.Dollar className="w-4 h-4"/> Cost/Unit
                            </div>
                        </div>
                        <textarea 
                            placeholder="Description" 
                            className="w-full p-3 border-2 border-black h-24 font-mono text-sm rounded-lg"
                            value={bountyForm.desc} onChange={e => setBountyForm({...bountyForm, desc: e.target.value})}
                        />
                    </div>
                )}

                {/* AD FORM (UPDATED WITH IMAGE UPLOAD & FLEXIBLE PRICE & ESTIMATOR) */}
                {campaignType === 'ad' && (
                    <div className="space-y-4 max-w-lg animate-in fade-in">
                        <div className="text-sm font-mono text-gray-500 mb-2">Target: Fixers in Feed • Goal: Tool/Service Sales</div>
                        <input 
                            placeholder="Product/Service Name (e.g., Pro Tech Toolkit)" 
                            className="w-full p-3 border-2 border-black font-bold rounded-lg"
                            value={adForm.title} onChange={e => setAdForm({...adForm, title: e.target.value})}
                        />
                        <div className="flex gap-4">
                            <div className="w-1/2 relative">
                                <input 
                                    placeholder="Daily Budget (£)" 
                                    type="number"
                                    className="w-full p-3 border-2 border-black font-bold bg-yellow-50 rounded-lg"
                                    value={adForm.budget} onChange={e => setAdForm({...adForm, budget: e.target.value})}
                                />
                                {/* Impression Estimator */}
                                {adForm.budget && (
                                    <div className="absolute top-full left-0 mt-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 border border-green-200 animate-in fade-in w-full rounded-md">
                                        ⚡ Est. Daily Reach: {Math.floor(adForm.budget * 250).toLocaleString()} views
                                    </div>
                                )}
                            </div>
                            <input 
                                placeholder="Display Price / Label" 
                                className="w-1/2 p-3 border-2 border-black font-bold rounded-lg"
                                value={adForm.price} onChange={e => setAdForm({...adForm, price: e.target.value})}
                            />
                        </div>

                        {/* Image Upload for Ad */}
                        <div>
                            <label className="font-bold uppercase text-sm block mb-1">Ad Creative</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {adImages.map((src, index) => (
                                    <div key={index} className="relative aspect-square border-2 border-black bg-gray-100 group rounded-lg overflow-hidden">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => removeAdImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 rounded-full"
                                        >
                                            <Icons.X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-lg">
                                    <Icons.Upload className="w-6 h-6 mb-2 text-gray-400" />
                                    <span className="text-[10px] font-bold uppercase text-gray-500">Upload</span>
                                    <input type="file" multiple accept="image/*" onChange={handleAdImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <textarea 
                            placeholder="Ad Copy / Description" 
                            className="w-full p-3 border-2 border-black h-24 font-mono text-sm rounded-lg"
                            value={adForm.desc} onChange={e => setAdForm({...adForm, desc: e.target.value})}
                        />
                    </div>
                )}

                {/* SNIPER FORM */}
                {campaignType === 'sniper' && (
                    <div className="space-y-4 max-w-lg animate-in fade-in">
                        <div className="text-sm font-mono text-gray-500 mb-2">Target: Sellers • Goal: Bulk Acquisition</div>
                        <input 
                            placeholder="Keywords (e.g., PS5, Broken HDMI)" 
                            className="w-full p-3 border-2 border-black font-bold rounded-lg"
                            value={sniperForm.keywords} onChange={e => setSniperForm({...sniperForm, keywords: e.target.value})}
                        />
                        <div className="flex gap-4">
                            <input 
                                placeholder="Max Price (£)" 
                                type="number"
                                className="w-1/2 p-3 border-2 border-black font-bold rounded-lg"
                                value={sniperForm.maxPrice} onChange={e => setSniperForm({...sniperForm, maxPrice: e.target.value})}
                            />
                            <input 
                                placeholder="Target Quantity" 
                                type="number"
                                className="w-1/2 p-3 border-2 border-black font-bold rounded-lg"
                                value={sniperForm.quantity} onChange={e => setSniperForm({...sniperForm, quantity: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                <BrutalistButton variant="black" className="w-full py-4 mt-6" onClick={handleLaunch}>
                    {campaignType === 'bounty' && 'Launch Bounty Program'}
                    {campaignType === 'ad' && 'Publish Sponsored Ad'}
                    {campaignType === 'sniper' && 'Activate Inventory Bot'}
                </BrutalistButton>
            </div>
        </div>
    );
};

// 10. ListingCard
const ListingCard = ({ item, onClick, theme }) => {
    const isAd = item.type === 'ad';
    const isDonation = item.type === 'donation';
    const isModern = theme === 'modern';
    
    return (
        <div onClick={() => onClick(item)} className={`bg-white transition-all duration-200 cursor-pointer group flex flex-col h-full relative ${isModern ? 'rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden' : 'border-2 border-black brutalist-shadow rounded-xl'} ${isAd ? (isModern ? 'border-blue-200 bg-blue-50' : 'border-blue-600') : ''}`}>
            <div className="absolute top-2 left-2 z-10">
                {isAd ? <Tag theme={theme} color="bg-blue-200">SPONSORED</Tag> : 
                 isDonation ? <Tag theme={theme} color="bg-purple-200">FREE / TRADE</Tag> : 
                 <Tag theme={theme} color={item.difficulty === 'Easy' ? 'bg-green-300' : 'bg-yellow-300'}>{item.difficulty}</Tag>
                }
            </div>
            <div className={`relative aspect-square bg-gray-100 overflow-hidden ${!isModern && 'border-b-2 border-black rounded-t-xl'}`}>
                <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-transform duration-500 ${!isAd && 'grayscale group-hover:grayscale-0'}`} />
                <div className={`absolute bottom-0 right-0 px-3 py-1 font-mono font-bold ${isModern ? 'bg-white/90 backdrop-blur text-black m-2 rounded-lg shadow-sm' : 'bg-black text-white border-l-2 border-t-2 border-black rounded-tl-lg'}`}>
                    {isAd ? `£${item.price}` : (item.price > 0 ? `£${Number(item.price).toFixed(2)}` : 'JUST SHIPPING')}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div><h3 className={`text-lg leading-tight mb-2 line-clamp-2 ${isModern ? 'font-bold text-gray-900' : 'font-black uppercase'}`}>{item.title}</h3><p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p></div>
                
                {/* Updated Metadata Section */}
                <div className={`flex justify-between items-center mt-2 pt-2 ${isModern ? 'border-t border-gray-100' : 'border-t-2 border-gray-100'}`}>
                    {!isAd && (
                        <div className="flex items-center gap-1 text-xs font-bold text-red-600 uppercase">
                            <Icons.AlertTriangle className="w-3 h-3" />{item.condition}
                        </div>
                    )}
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-gray-400">@{item.seller}</span>
                            {item.sellerRating && (
                                <div className="flex items-center text-[10px] font-bold text-yellow-600 bg-yellow-100 px-1 rounded ml-1">
                                    <Icons.Star className="w-2 h-2 fill-yellow-600 mr-0.5" />
                                    {item.sellerRating}
                                </div>
                            )}
                        </div>
                        {item.location && (
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase mt-1">
                                <Icons.MapPin className="w-3 h-3" />
                                {item.location}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 11. DetailView
const DetailView = ({ activeItem, goHome, onRescueInitiate, onChatInitiate, showToast, theme, isSaved, onToggleSave }) => {
    const isModern = theme === 'modern';
    const isAd = activeItem.type === 'ad';
    const isDonation = activeItem.type === 'donation';
    const [guideLoading, setGuideLoading] = useState(false);
    const [repairGuide, setRepairGuide] = useState('');
    const [profitData, setProfitData] = useState('');
    const [profitLoading, setProfitLoading] = useState(false);
    const [modData, setModData] = useState('');
    const [modLoading, setModLoading] = useState(false);
    const [scavengeData, setScavengeData] = useState('');
    const [scavengeLoading, setScavengeLoading] = useState(false);
    const [roastData, setRoastData] = useState('');
    const [roastLoading, setRoastLoading] = useState(false);
    
    const fetchRepairGuide = async () => { setGuideLoading(true); const result = await callGemini(`Repair guide for ${activeItem.title}`, 'repair'); setRepairGuide(result); setGuideLoading(false); };
    const fetchProfitCalc = async () => { setProfitLoading(true); const result = await callGemini(`Profit calc for ${activeItem.title}`, 'profit'); setProfitData(result); setProfitLoading(false); };
    const fetchModOps = async () => { setModLoading(true); const result = await callGemini(`Mod ideas for ${activeItem.title}`, 'mod'); setModData(result); setModLoading(false); };
    const fetchScavenge = async () => { setScavengeLoading(true); const result = await callGemini(`Scavenge parts for ${activeItem.title}`, 'scavenge'); setScavengeData(result); setScavengeLoading(false); };
    const fetchRoast = async () => { setRoastLoading(true); const result = await callGemini(`Roast ${activeItem.title}`, 'roast'); setRoastData(result); setRoastLoading(false); };

    const handleAdClick = () => { showToast("Tracking Click... Redirecting"); };
    const handleChat = () => { onChatInitiate(activeItem); };
    const handleSave = () => { onToggleSave(); };

    return (
        <div className="max-w-5xl mx-auto fade-in">
            <button onClick={goHome} className="mb-6 flex items-center gap-2 font-bold hover:underline"><Icons.ArrowLeft className="w-4 h-4"/> Back</button>
            <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className={`bg-white overflow-hidden ${isModern ? 'rounded-2xl shadow-sm border border-gray-200' : 'border-2 border-black p-2 brutalist-shadow rounded-xl'}`}><img src={activeItem.image} className={`w-full h-auto ${!isAd && !isModern && 'grayscale'}`} /></div>
                </div>
                <div className={`bg-white h-fit flex flex-col ${isModern ? 'rounded-2xl shadow-sm border border-gray-200 p-8' : 'border-2 border-black p-6 brutalist-shadow-sm rounded-xl'}`}>
                    <div className="flex justify-between items-start mb-4">{isAd ? <Tag theme={theme} color="bg-blue-200">SPONSORED</Tag> : <><Tag theme={theme} color="bg-yellow-300">{activeItem.category}</Tag><Tag theme={theme} color="bg-red-200">{activeItem.condition}</Tag></>}</div>
                    <h1 className={`text-3xl leading-tight mb-2 ${isModern ? 'font-bold' : 'font-black uppercase'}`}>{activeItem.title}</h1>
                    
                    {/* Location & Seller Rating */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-bold text-gray-500">
                        {activeItem.location && (
                            <div className="flex items-center gap-1">
                                <Icons.MapPin className="w-4 h-4" />
                                <span>{activeItem.location}</span>
                            </div>
                        )}
                        {activeItem.sellerRating && (
                            <div className="flex items-center gap-1">
                                <Icons.Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                <span className="text-black">{activeItem.sellerRating}</span>
                                <span className="text-gray-400 font-normal">({activeItem.reviews} reviews)</span>
                            </div>
                        )}
                    </div>

                    {/* FIX: Handle Number/String Price */}
                    <div className="text-4xl font-mono font-bold text-purple-700 mb-6">{isAd ? `£${activeItem.price}` : (activeItem.price > 0 ? `£${Number(activeItem.price).toFixed(2)}` : 'FREE (Just Shipping)')}</div>
                    
                    <div className={`p-4 mb-6 text-sm relative ${isModern ? 'bg-gray-50 rounded-xl' : 'bg-gray-50 border-2 border-black rounded-lg'}`}>{activeItem.description}</div>
                    {!isAd ? (
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                            {/* AI Tools */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                 <ThemedButton theme={theme} variant="purple" className="py-2 text-xs" onClick={fetchRepairGuide} disabled={guideLoading}>{guideLoading ? '...' : '✨ Repair Guide'}</ThemedButton>
                                 <ThemedButton theme={theme} variant="blue" className="py-2 text-xs" onClick={fetchProfitCalc} disabled={profitLoading}>{profitLoading ? '...' : '💸 Profit Calc'}</ThemedButton>
                                 <ThemedButton theme={theme} variant="pink" className="py-2 text-xs" onClick={fetchModOps} disabled={modLoading}>{modLoading ? '...' : '🎨 Mod Ideas'}</ThemedButton>
                                 <ThemedButton theme={theme} variant="orange" className="py-2 text-xs" onClick={fetchScavenge} disabled={scavengeLoading}>{scavengeLoading ? '...' : '🔍 Scavenge'}</ThemedButton>
                                 <div className="col-span-2"><ThemedButton theme={theme} variant="red" className="w-full py-2 text-xs" onClick={fetchRoast} disabled={roastLoading}>{roastLoading ? '...' : '💀 Roast My Junk'}</ThemedButton></div>
                            </div>
                            
                            {/* AI Responses */}
                            {repairGuide && <div className="bg-purple-50 p-4 text-xs mb-2 border-l-4 border-purple-500 ai-response">{repairGuide}</div>}
                            {profitData && <div className="bg-blue-50 p-4 text-xs mb-2 border-l-4 border-blue-500 ai-response">{profitData}</div>}
                            {modData && <div className="bg-pink-50 p-4 text-xs mb-2 border-l-4 border-pink-500 ai-response">{modData}</div>}
                            {scavengeData && <div className="bg-orange-50 p-4 text-xs mb-2 border-l-4 border-orange-500 ai-response">{scavengeData}</div>}
                            {roastData && <div className="bg-red-50 p-4 text-xs mb-2 border-l-4 border-red-500 italic ai-response">"{roastData}"</div>}

                            {/* Actions */}
                            <ThemedButton theme={theme} variant={isDonation ? "purple" : "green"} className="w-full py-4 text-lg" onClick={() => onRescueInitiate(activeItem)}>
                                {isDonation ? "Claim for Shipping Only (£3.99)" : "Rescue This Item"}
                            </ThemedButton>
                            
                            {/* NEW: BROKEYGUARD ESCROW BADGE */}
                            <div className={`flex items-center justify-center gap-2 text-xs py-2 ${isModern ? 'text-green-600 bg-green-50 rounded-lg' : 'text-black border-2 border-black bg-green-300 rounded-lg'}`}>
                                <Icons.Shield className="w-4 h-4" />
                                <span className="font-bold">Protected by BrokeyGuard™ Escrow</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <ThemedButton theme={theme} variant="secondary" className="py-3" onClick={handleChat}><Icons.MessageCircle className="w-4 h-4"/> Chat</ThemedButton>
                                <ThemedButton theme={theme} variant="secondary" className="py-3" onClick={handleSave}>
                                    {isSaved ? <Icons.Heart className="w-4 h-4 fill-red-500 text-red-500"/> : <Icons.Heart className="w-4 h-4"/>} 
                                    {isSaved ? 'Saved' : 'Save'}
                                </ThemedButton>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-auto"><ThemedButton theme={theme} variant="blue" className="w-full py-5 text-xl" onClick={handleAdClick}>Visit Store <Icons.Link className="w-5 h-5 ml-2"/></ThemedButton></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 12. ForumView
const ForumView = ({ showToast, theme }) => {
    const [activeThread, setActiveThread] = useState(null);
    const [showNewThread, setShowNewThread] = useState(false);
    const [threads, setThreads] = useState(MOCK_FORUM_THREADS);
    const [newTitle, setNewTitle] = useState(''); const [newBody, setNewBody] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReplies, setActiveReplies] = useState([]); 
    const [aiDrafting, setAiDrafting] = useState(false);
    const [safetyMsg, setSafetyMsg] = useState('');

    const openThread = (thread) => { 
        setActiveThread(thread); 
        setActiveReplies([{ id: 1, author: "FixItFelix", content: "Check the capacitors!", time: "2h ago" }]);
        setSafetyMsg(''); 
    };

    const handlePostReply = () => { if (!replyText.trim()) return; setActiveReplies([...activeReplies, { id: Date.now(), author: "You", content: replyText, time: "Just now" }]); setReplyText(""); showToast("Reply Posted!"); };
    const handleCreateThread = () => { if(!newTitle) return; setThreads([{ id: Date.now(), title: newTitle, author: "You", replies: 0, category: "Repair Help", views: 1, content: newBody }, ...threads]); setShowNewThread(false); };
    
    const handleAiDraft = async () => { setAiDrafting(true); const result = await callGemini('Draft forum post', 'forum_draft'); const parts = result.split('Body:'); setNewTitle(parts[0].replace('Title:', '').trim()); setNewBody(parts[1] ? parts[1].trim() : ""); setAiDrafting(false); };

    const handleSafetyCheck = async () => {
         setSafetyMsg("Scanning...");
         const result = await callGemini("Check safety", "safety");
         setSafetyMsg(result);
    };

    return (
        <div className={`max-w-4xl mx-auto space-y-6 fade-in ${theme === 'modern' ? 'font-modern' : ''}`}>
            <div className="flex justify-between items-end mb-8"><div><h1 className="text-4xl font-black uppercase italic">The Scrapyard</h1><p>Community Forum</p></div><ThemedButton theme={theme} onClick={() => setShowNewThread(true)}>New Thread</ThemedButton></div>
            {!activeThread ? (
                <div className="space-y-4">{threads.map(thread => (
                    <div key={thread.id} onClick={() => openThread(thread)} className={`p-4 cursor-pointer flex justify-between items-center ${theme === 'modern' ? 'bg-white rounded-xl shadow-sm border border-gray-100' : 'bg-white border-2 border-black brutalist-shadow-hover rounded-xl'}`}>
                        <div><div className="flex items-center gap-2 mb-1"><Tag theme={theme} color="bg-blue-100">{thread.category}</Tag> <span className="text-xs font-bold text-gray-400">@{thread.author}</span></div><h3 className="text-xl font-bold">{thread.title}</h3></div>
                        <div className="text-right text-sm"><div>{thread.replies} Replies</div></div>
                    </div>
                ))}</div>
            ) : (
                <div className="space-y-6">
                    <button onClick={() => setActiveThread(null)} className="flex items-center gap-2 font-bold hover:underline mb-4">Back</button>
                    <div className={`p-6 ${theme === 'modern' ? 'bg-white rounded-xl shadow-sm' : 'bg-white border-2 border-black brutalist-shadow'}`}>
                        <div className="flex justify-between items-start"><h1 className="text-3xl font-black mb-4">{activeThread.title}</h1><button onClick={handleSafetyCheck} className="text-xs flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded border border-yellow-300 hover:bg-yellow-200"><Icons.Shield className="w-3 h-3"/> Safety Check</button></div>
                        {safetyMsg && <div className="mb-4 bg-yellow-50 p-3 text-sm border-l-4 border-yellow-500 ai-response">{safetyMsg}</div>}
                        <p className="leading-relaxed">{activeThread.content}</p>
                    </div>
                    <div className="pl-4 border-l-4 border-gray-300 space-y-4">{activeReplies.map(reply => (<div key={reply.id} className={`p-4 ${theme === 'modern' ? 'bg-white rounded-lg shadow-sm' : 'bg-gray-50 border-2 border-black rounded-lg'}`}><div className="flex justify-between mb-2"><span className="font-bold text-purple-600">@{reply.author}</span><span className="text-xs text-gray-400">{reply.time}</span></div><p>{reply.content}</p></div>))}</div>
                    <div className={`p-4 ${theme === 'modern' ? 'bg-white rounded-xl' : 'bg-white border-2 border-black rounded-xl'}`}><textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="w-full p-3 border border-gray-300 rounded mb-2" placeholder="Reply..." /><ThemedButton theme={theme} onClick={handlePostReply}>Post</ThemedButton></div>
                </div>
            )}
            {showNewThread && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className={`bg-white p-6 max-w-lg w-full relative ${theme === 'modern' ? 'rounded-2xl' : 'border-4 border-black brutalist-shadow rounded-xl'}`}>
                        <button onClick={() => setShowNewThread(false)} className="absolute top-2 right-2">X</button>
                        <h2 className="text-2xl font-bold mb-4">New Thread</h2>
                        <div className="flex justify-end mb-2"><button onClick={handleAiDraft} className="text-xs text-purple-600 flex gap-1 items-center">{aiDrafting ? 'Drafting...' : '✨ Auto-Draft'}</button></div>
                        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border border-black mb-4 rounded-lg" placeholder="Title" />
                        <textarea value={newBody} onChange={e => setNewBody(e.target.value)} className="w-full p-2 border border-black h-32 mb-4 rounded-lg" placeholder="Content" />
                        <ThemedButton theme={theme} onClick={handleCreateThread} className="w-full">Post</ThemedButton>
                    </div>
                </div>
            )}
        </div>
    );
};

// 13. ProfileView
const ProfileView = ({ user, onMarkSoldInitiate, showToast, onSpendPoints, onActivateBounty, onClaimBounty, onUpdateUser, theme, onLogout, onToggleSave }) => { 
    const [activeTab, setActiveTab] = useState('listings');
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editHandle, setEditHandle] = useState(user.handle);
    const [activeLeaderboard, setActiveLeaderboard] = useState('individual'); // 'individual' | 'corporate'
    
    const handleSaveProfile = () => { onUpdateUser({ ...user, name: editName, handle: editHandle }); setIsEditing(false); showToast("Profile Updated!"); };
    const handlePrintLabel = () => { showToast("📄 Downloading Shipping Label (PDF)..."); };
    
    // ... (Rank logic same as before) ...
    const getRank = (score) => {
        if (score > 100) return "Repair God";
        if (score > 50) return "Soldering Sage";
        if (score > 20) return "Component Collector";
        if (score > 5) return "Scrap Apprentice";
        return "Landfill Lurker";
    };
    const getProgress = (score) => { if (score > 100) return 100; if (score > 50) return ((score - 50) / 50) * 100; if (score > 20) return ((score - 20) / 30) * 100; if (score > 5) return ((score - 5) / 15) * 100; return (score / 5) * 100; };
    const rank = getRank(user.impactScore);
    const progress = getProgress(user.impactScore);
    
    // Sort logic for individual leaderboard (including current user)
    const leaderboardIndividual = [...MOCK_LEADERBOARD_INDIVIDUAL];
    leaderboardIndividual[2].score = user.impactScore.toFixed(1);
    leaderboardIndividual.sort((a,b) => b.score - a.score);

    const currentLeaderboard = activeLeaderboard === 'individual' ? leaderboardIndividual : MOCK_LEADERBOARD_CORP;

    return (
        <div className={`max-w-4xl mx-auto space-y-8 fade-in ${theme === 'modern' ? 'font-modern' : ''}`}>
            <div className={`p-6 flex items-center gap-6 ${theme === 'modern' ? 'bg-white rounded-2xl shadow-sm' : 'bg-white border-2 border-black brutalist-shadow rounded-xl'}`}>
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center font-bold text-3xl">{user.name.charAt(0)}</div>
                <div className="flex-grow">
                    {isEditing ? ( <div className="space-y-2"><input value={editName} onChange={e => setEditName(e.target.value)} className="text-4xl font-black border-b border-black w-full bg-transparent"/><input value={editHandle} onChange={e => setEditHandle(e.target.value)} className="font-mono text-gray-500 border-b border-black w-full bg-transparent"/></div> ) : ( <><h1 className="text-4xl font-black">{user.name}</h1><p>@{user.handle} • Impact: {user.impactScore}kg</p></> )}
                </div>
                <div className="flex flex-col gap-2"><ThemedButton theme={theme} onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)} variant="ghost">{isEditing ? 'Save' : 'Edit'}</ThemedButton><button onClick={onLogout} className="text-xs text-red-500 underline hover:text-red-700">Log Out</button></div>
            </div>
            
            {/* Stats */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black text-white border-2 border-black brutalist-shadow p-6 flex flex-col justify-between relative overflow-hidden rounded-xl"><div className="absolute top-0 right-0 p-4 opacity-20"><Icons.TrendingUp className="w-32 h-32" /></div><div><h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Impact Score</h3><div className="text-6xl font-tech font-bold text-green-400">{user.impactScore.toFixed(1)}<span className="text-2xl">kg</span></div><p className="text-sm text-gray-400 mt-2">E-Waste Diverted From Landfill</p></div></div>
                <div className="bg-white border-2 border-black brutalist-shadow p-6 flex flex-col justify-center space-y-4 rounded-xl"><div className="flex justify-between items-end"><div><h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-1">Current Rank</h3><div className="text-3xl font-black uppercase italic text-purple-700">{rank}</div></div><Icons.Wrench className="w-8 h-8 text-gray-300" /></div><div className="space-y-1"><div className="flex justify-between text-xs font-bold uppercase"><span>Progress to next rank</span><span>{Math.round(progress)}%</span></div><div className="h-4 border-2 border-black bg-gray-100 relative rounded-full overflow-hidden"><div className="absolute top-0 left-0 h-full bg-yellow-400 border-r-2 border-black transition-all duration-1000" style={{ width: `${progress}%` }}></div><div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(45deg,rgba(0,0,0,.1) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.1) 75%,transparent 75%,transparent)', backgroundSize: '10px 10px'}}></div></div></div></div>
            </div>

            <div className="flex gap-4 border-b border-black pb-1 overflow-x-auto">
                <button onClick={() => setActiveTab('listings')} className={`font-bold whitespace-nowrap ${activeTab === 'listings' ? 'text-black' : 'text-gray-400'}`}>My Junkyard</button>
                <button onClick={() => setActiveTab('wallet')} className={`font-bold whitespace-nowrap ${activeTab === 'wallet' ? 'text-black' : 'text-gray-400'}`}>Wallet & Credits</button>
                <button onClick={() => setActiveTab('bounties')} className={`font-bold whitespace-nowrap ${activeTab === 'bounties' ? 'text-black' : 'text-gray-400'}`}>Missions</button>
                <button onClick={() => setActiveTab('saved')} className={`font-bold whitespace-nowrap ${activeTab === 'saved' ? 'text-black' : 'text-gray-400'}`}>Saved</button>
                <button onClick={() => setActiveTab('rewards')} className={`font-bold whitespace-nowrap ${activeTab === 'rewards' ? 'text-black' : 'text-gray-400'}`}>Leaderboard</button>
            </div>

            {activeTab === 'listings' && (
                <div className="space-y-4">
                    {user.listings.map(item => (
                        <div key={item.id} className={`p-4 flex gap-4 items-center ${theme === 'modern' ? 'bg-white rounded-xl shadow-sm' : 'bg-white border-2 border-black rounded-lg'}`}>
                            <div className="w-16 h-16 bg-gray-200"><img src={item.image} className="w-full h-full object-cover"/></div>
                            <div className="flex-grow">
                                <h3 className="font-bold">{item.title}</h3>
                                <div className="text-xs text-gray-500">Listed: £{item.price}</div>
                            </div>
                            {item.status === 'sold' ? (
                                <div className="flex flex-col gap-2 items-end">
                                    <Tag theme={theme} color="bg-green-300">SOLD</Tag>
                                    <button 
                                        onClick={handlePrintLabel}
                                        className={`text-xs font-bold flex items-center gap-1 ${theme === 'modern' ? 'text-blue-600 hover:text-blue-800' : 'text-black hover:underline'}`}
                                    >
                                        <Icons.Upload className="w-3 h-3 rotate-180"/> Get Label
                                    </button>
                                </div>
                            ) : (
                                <ThemedButton theme={theme} onClick={() => onMarkSoldInitiate(item)} className="text-xs px-3 py-1">Mark Sold</ThemedButton>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'wallet' && (
                <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                    <div className={`p-6 ${theme === 'modern' ? 'bg-white rounded-xl shadow-sm border border-gray-100' : 'bg-white border-2 border-black rounded-xl'}`}>
                        <h3 className="font-bold uppercase text-gray-500 mb-4">Cash Balance</h3>
                        <div className="text-4xl font-mono font-bold mb-4">£45.00</div>
                        <BrutalistButton theme={theme} className="w-full text-xs py-2">Withdraw to Bank</BrutalistButton>
                    </div>
                    <div className={`p-6 ${theme === 'modern' ? 'bg-green-50 rounded-xl border border-green-100' : 'bg-green-100 border-2 border-black rounded-xl'}`}>
                        <h3 className="font-bold uppercase text-green-800 mb-4">Eco-Credits</h3>
                        <div className="text-4xl font-mono font-bold mb-1 text-green-900">250 <span className="text-sm">pts</span></div>
                        <p className="text-xs text-green-700 mb-4">Worth ~£25 in partner vouchers</p>
                        <BrutalistButton theme={theme} variant="green" className="w-full text-xs py-2" onClick={() => setActiveTab('rewards')}>Redeem Rewards</BrutalistButton>
                    </div>
                </div>
            )}

            {activeTab === 'bounties' && (
                <div className="space-y-4">
                    {user.activeBounties.length === 0 && <div className="p-4 text-gray-500">No active missions.</div>}
                    {user.activeBounties.map(b => (
                        <div key={b.id} className={`p-4 border-2 border-black ${b.color} rounded-lg`}><h4 className="font-bold">{b.title}</h4><p className="text-sm">{b.desc}</p><BrutalistButton onClick={() => onClaimBounty(b)} className="mt-2 text-xs">Claim Reward</BrutalistButton></div>
                    ))}
                </div>
            )}
            {activeTab === 'saved' && (
                <div className="space-y-4">
                    {(!user.saved || user.saved.length === 0) ? <div className="text-center text-gray-500 py-8">No saved items yet.</div> : user.saved.map(item => (
                        <div key={item.id} className={`p-4 flex gap-4 items-center ${theme === 'modern' ? 'bg-white rounded-xl shadow-sm' : 'bg-white border-2 border-black rounded-lg'}`}>
                            <div className="w-16 h-16 bg-gray-200"><img src={item.image} className="w-full h-full object-cover"/></div>
                            <div className="flex-grow"><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">£{item.price}</p></div>
                            <ThemedButton theme={theme} className="text-xs" onClick={() => onToggleSave(item)} variant="secondary">Remove</ThemedButton> 
                        </div>
                    ))}
                </div>
            )}
             {activeTab === 'rewards' && (
                <div className="space-y-8 animate-in fade-in">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic mb-4 flex items-center gap-2"><Icons.ShoppingBag className="w-6 h-6" /> Redeem Eco-Credits</h3>
                        <div className="grid sm:grid-cols-2 gap-4">{MOCK_REWARDS.map(reward => (<div key={reward.id} className="bg-white border-2 border-black p-4 flex flex-col justify-between rounded-xl"><div className="mb-4"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><div className="p-2 bg-yellow-100 border-2 border-black rounded-full">{reward.icon}</div>{reward.partner && <span className="text-[10px] font-bold uppercase bg-gray-100 border border-black px-2 py-0.5 rounded-full">{reward.partner}</span>}</div><div className="font-tech font-bold text-lg">{reward.cost}pts</div></div><h4 className="font-bold uppercase">{reward.title}</h4><p className="text-xs text-gray-500 leading-tight mt-1">{reward.desc}</p></div><BrutalistButton variant="black" className="w-full py-2 text-xs" onClick={() => onSpendPoints(reward.cost, reward.title)} disabled={false}>Redeem</BrutalistButton></div>))}</div>
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-black uppercase italic flex items-center gap-2"><Icons.Trophy className="w-6 h-6" /> Leaderboard</h3>
                            <div className="flex bg-white border-2 border-black rounded-lg overflow-hidden">
                                <button onClick={() => setActiveLeaderboard('individual')} className={`px-3 py-1 text-xs font-bold uppercase ${activeLeaderboard === 'individual' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>Fixers</button>
                                <button onClick={() => setActiveLeaderboard('corporate')} className={`px-3 py-1 text-xs font-bold uppercase ${activeLeaderboard === 'corporate' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>Companies</button>
                            </div>
                        </div>
                        <div className="bg-white border-2 border-black divide-y-2 divide-black rounded-xl overflow-hidden">
                            {currentLeaderboard.map((entry, i) => (
                                <div key={i} className={`p-4 flex items-center justify-between ${entry.name.includes('(You)') ? 'bg-yellow-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="font-black text-xl w-8 text-center">#{i + 1}</div>
                                        <div>
                                            <div className="font-bold uppercase flex items-center gap-2">
                                                {entry.name}
                                                {activeLeaderboard === 'corporate' && <Icons.Building className="w-3 h-3 text-gray-400"/>}
                                            </div>
                                            <div className="text-xs text-gray-500">{entry.tag}</div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-bold text-green-600">{entry.score}kg</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const InventoryScout = ({ showToast }) => (
    <div className="max-w-4xl mx-auto p-4 bg-black text-white border-2 border-black brutalist-shadow rounded-xl">
        <h3 className="text-2xl font-bold flex gap-2"><Icons.Ghost className="w-6 h-6"/> Inventory Scout</h3>
        <p>Admin Tool: Scanning eBay...</p>
        <div className="mt-4 space-y-2">
            {MOCK_SCOUT_RESULTS.map(r => (
                <div key={r.id} className="bg-white text-black p-2 flex justify-between items-center rounded-lg">
                    <span>{r.title}</span>
                    <button onClick={() => showToast("Magic Link Copied")} className="text-xs bg-black text-white px-2 py-1 rounded">Copy Link</button>
                </div>
            ))}
        </div>
    </div>
);

// --- 14. DemoControls (NEW) ---
const DemoControls = ({ user, setUser, setView }) => {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
            <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-t-lg">Demo Controls</div>
            <div className="bg-white border-2 border-black p-2 rounded-b-lg rounded-tr-lg shadow-lg flex flex-col gap-2">
                <button 
                    onClick={() => { setUser(null); setView('feed'); }}
                    className="text-xs font-bold text-left hover:bg-gray-100 p-1 rounded"
                >
                    👤 View as Guest
                </button>
                <button 
                    onClick={() => { 
                        setUser({ name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [], type: 'user' }); 
                        setView('feed'); 
                    }}
                    className="text-xs font-bold text-left hover:bg-gray-100 p-1 rounded"
                >
                    🔧 Login as Fixer
                </button>
                <button 
                    onClick={() => { 
                        setUser({ name: "Biz Partner", handle: "biz_admin", impactScore: 0, listings: [], rescued: [], activeBounties: [], type: 'business', saved: [] }); 
                        setView('business'); 
                    }}
                    className="text-xs font-bold text-left hover:bg-gray-100 p-1 rounded"
                >
                    💼 Login as Business
                </button>
            </div>
        </div>
    );
};

// --- 15. MAIN APP COMPONENT ---
export default function App() {
    const [view, setView] = useState('feed'); 
    const [theme, setTheme] = useState('brutalist');
    const [activeItem, setActiveItem] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [ads, setAds] = useState([...INITIAL_ADS]);
    // FIX: Initialize saved array to prevent crash on toggle save
    const [user, setUser] = useState({ name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [] });
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Modals
    const [showRescue, setShowRescue] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showSold, setShowSold] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [showReview, setShowReview] = useState(false); // NEW STATE
    
    const [pendingItem, setPendingItem] = useState(null);
    const [pendingClaimBounty, setPendingClaimBounty] = useState(null);
    const [showBountyClaimModal, setShowBountyClaimModal] = useState(false);
    // Celebration & Checkout State
    const [celebrationData, setCelebrationData] = useState({ weight: 0, name: '', type: '' });
    const [acceptedPrice, setAcceptedPrice] = useState(0);

    const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };
    const handleCreateAd = (ad) => { setAds([ad, ...ads]); };
    
    // Auth Handlers
    const handleLogin = (data) => {
         if (data.type === 'business') {
             setUser({ name: "Biz Partner", handle: "biz_admin", impactScore: 0, listings: [], rescued: [], activeBounties: [], type: 'business', saved: [] });
             setView('business');
         } else {
             const mockUser = { name: "ScrapMaster", handle: "scrap_daddy", impactScore: 12.5, listings: MOCK_LISTINGS.slice(0,1), rescued: [], activeBounties: [], saved: [] };
             setUser(mockUser);
             setView('feed');
         }
         showToast("Welcome back!");
    };
    const handleSignup = (data) => {
         const newUser = { name: data.name, handle: data.handle, impactScore: 0, listings: [], rescued: [], activeBounties: [], type: data.type, saved: [] };
         setUser(newUser);
         if (data.type === 'business') setView('business');
         else setView('feed');
         showToast("Account Created!");
    };
    
    // NEW: Toggle Save
    const handleToggleSave = (item) => {
        if (!user) return; // Auth checked before calling
        
        // FIX: Ensure user.saved is defined before using .find()
        const savedItems = user.saved || []; 
        const isAlreadySaved = savedItems.find(i => i.id === item.id);
        
        let newSaved;
        if (isAlreadySaved) {
            newSaved = savedItems.filter(i => i.id !== item.id);
            showToast("Removed from wishlist");
        } else {
            newSaved = [...savedItems, item];
            showToast("Saved to wishlist");
        }
        setUser({ ...user, saved: newSaved });
    };

    const handleLogout = () => {
        setUser(null);
        setView('feed');
        showToast("Logged out.");
    };

    const requireAuth = (targetView) => {
        if (!user) {
            setView('auth');
            showToast("Please log in first.");
        } else {
            setView(targetView);
        }
    };

    const getFeedItems = () => {
        let items = [...MOCK_LISTINGS];
        if (user && user.type !== 'business') items = [...items, ...user.listings.filter(l => l.seller === 'You')];
        
        if (selectedCategory !== 'All') {
            items = items.filter(item => item.category === selectedCategory);
        }

        if(ads.length > 0) items.splice(1, 0, ads[0]);
        return items;
    };

    const handlePostListing = (item) => {
        setUser({ ...user, listings: [item, ...user.listings] });
        setView('profile');
    };

    const handleSoldConfirm = (buyer) => {
        setUser({ ...user, impactScore: user.impactScore + 2.5, listings: user.listings.map(l => l.id === pendingItem.id ? {...l, status: 'sold'} : l) });
        setShowSold(false);
        setShowCelebration(true);
    };
    
    // Modal Logic Handlers
    const onRescueInitiate = (item) => { if(!user) return requireAuth('auth'); setPendingItem(item); setShowRescue(true); };
    const onChatInitiate = (item) => { if(!user) return requireAuth('auth'); setPendingItem(item); setShowChat(true); };
    
    // NEW: Handle Offer / Buy Logic
    const handleSendOffer = (price, msg) => { 
        setShowRescue(false); 
        setAcceptedPrice(price); // Store the agreed price
        
        const isFullPrice = parseFloat(price) >= parseFloat(pendingItem.price);
        
        if (isFullPrice) {
            // Instant Buy -> Go to Checkout immediately
            setShowCheckout(true);
        } else {
            // Offer Logic
            showToast(`Offer of £${price} sent! Waiting for seller...`);
            
            // SIMULATION: Seller Accepts after 3 seconds
            setTimeout(() => {
                showToast(`🎉 @${pendingItem.seller} Accepted your offer!`);
                setShowCheckout(true); // Go to Checkout after acceptance
            }, 3000);
        }
    };
    
    const handlePaymentComplete = () => {
        setShowCheckout(false);
        const weight = CATEGORY_WEIGHTS[pendingItem.category] || 1.0;
        setUser(prev => ({ 
            ...prev, 
            impactScore: prev.impactScore + weight, 
            rescued: [pendingItem, ...prev.rescued] 
        }));
        setCelebrationData({ weight, name: pendingItem.seller, type: 'rescued' });
        setShowCelebration(true);
    };

    const handleSendMessage = (msg) => { setShowChat(false); showToast("Message Sent!"); };
    
    const handleConfirmClaim = (bounty) => {
         setUser(prev => ({ ...prev, activeBounties: prev.activeBounties.filter(b => b.id !== bounty.id), impactScore: prev.impactScore + 5 }));
         setShowBountyClaimModal(false);
         setCelebrationData({ weight: 5.0, name: bounty.brand, type: 'mission_complete' });
         setShowCelebration(true);
    };

    const handleReviewSubmit = (rating, comment) => {
        setShowReview(false);
        // Ensure celebration is closed in case it was somehow open
        setShowCelebration(false);
        showToast("Review Submitted! ⭐");
    };

    return (
        <div className={`min-h-screen pb-20 relative ${theme === 'modern' ? 'bg-gray-50 font-modern' : 'bg-[#f0f0f0] font-brutalist'}`}>
            <GlobalStyles />
            {toastMessage && <Toast message={toastMessage} />}
            {showRescue && <RescueModal item={pendingItem} onClose={() => setShowRescue(false)} onSendOffer={handleSendOffer} />}
            {showChat && <ChatModal item={pendingItem} onClose={() => setShowChat(false)} onSendMessage={handleSendMessage} />}
            {showSold && <SoldModal item={pendingItem} onClose={() => setShowSold(false)} onConfirm={handleSoldConfirm} />}
            {showReview && <ReviewModal seller={celebrationData.name} onClose={() => setShowReview(false)} onSubmit={handleReviewSubmit} />}
            
            {/* NEW CHECKOUT MODAL */}
            {showCheckout && <CheckoutModal item={pendingItem} offerPrice={acceptedPrice} theme={theme} onClose={() => setShowCheckout(false)} onPay={handlePaymentComplete} />}

            {/* Updated Celebration Modal call */}
            {showCelebration && (
                <CelebrationModal 
                    savedWeight={celebrationData.weight} 
                    counterpartName={celebrationData.name} 
                    type={celebrationData.type} 
                    onClose={() => setShowCelebration(false)} 
                    onRateSeller={() => {
                        // FIX: Explicitly close Celebration before opening Review
                        setShowCelebration(false);
                        setShowReview(true);
                    }}
                />
            )}
            
            {showBountyClaimModal && pendingClaimBounty && <BountyClaimModal bounty={pendingClaimBounty} onClose={() => setShowBountyClaimModal(false)} onConfirm={handleConfirmClaim} />}

            {/* DEMO CONTROLS WIDGET */}
            <DemoControls user={user} setUser={setUser} setView={setView} />

            <nav className={`sticky top-0 z-40 px-4 py-3 flex justify-between items-center ${theme === 'modern' ? 'bg-white/80 backdrop-blur border-b border-gray-200' : 'bg-white border-b-4 border-black'}`}>
                 <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('feed')}>
                    <div className={`p-2 bg-black text-white ${theme === 'modern' ? 'rounded-lg' : ''}`}><Icons.Wrench className="w-6 h-6"/></div>
                    <span className={`text-2xl ${theme === 'modern' ? 'font-bold' : 'font-black uppercase italic hidden md:block'}`}>BrokeyDokey</span>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={() => setView('investor')} className="text-xs font-bold uppercase border-2 border-black px-3 py-1 bg-yellow-400 hover:bg-yellow-300">Investors</button>
                     
                     <ThemedButton theme={theme} onClick={() => requireAuth('sell')} className="px-3 py-1 text-sm"><Icons.Plus className="w-4 h-4"/> Sell</ThemedButton>
                     
                     {user ? (
                        <>
                            <button onClick={() => requireAuth('forum')} className="p-2 hover:bg-gray-100 rounded-full"><Icons.Users className="w-6 h-6"/></button>
                            <button onClick={() => requireAuth('profile')} className="p-2 hover:bg-gray-100 rounded-full"><Icons.User className="w-6 h-6"/></button>
                            <button onClick={() => requireAuth('business')} className="p-2 hover:bg-gray-100 rounded-full"><Icons.Briefcase className="w-6 h-6"/></button>
                        </>
                     ) : (
                         <ThemedButton theme={theme} onClick={() => setView('auth')} variant="black" className="px-4 py-1 text-sm">Login</ThemedButton>
                     )}
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {view === 'auth' && <AuthView onLogin={handleLogin} onSignup={handleSignup} theme={theme} />}

                {view === 'feed' && (
                     <div className="space-y-8 fade-in">
                        <Hero theme={theme} onViewChange={(v) => { if(v === 'sell' && !user) setView('auth'); else setView(v); }} />
                        <ImpactDashboard theme={theme} totalSaved={1240} />
                        
                        <div className="flex gap-2 overflow-x-auto pb-4">
                            {['All', ...CATEGORIES].map((cat) => (
                                <button 
                                    key={cat} 
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 border-2 border-black font-bold uppercase whitespace-nowrap transition-all rounded-md ${selectedCategory === cat ? 'bg-black text-white shadow-none translate-y-1' : 'bg-white hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {getFeedItems().map((item, i) => (
                                <ListingCard key={i} item={item} theme={theme} onClick={(item) => { setActiveItem(item); setView('detail'); window.scrollTo(0,0); }} />
                            ))}
                        </div>
                    </div>
                )}
                
                {view === 'detail' && activeItem && <DetailView activeItem={activeItem} goHome={() => setView('feed')} showToast={showToast} theme={theme} onRescueInitiate={(i) => { if(!user) return requireAuth('auth'); setPendingItem(i); setShowRescue(true); }} onChatInitiate={(i) => { if(!user) return requireAuth('auth'); setPendingItem(i); setShowChat(true); }} isSaved={user && user.saved && user.saved.some(i => i.id === activeItem.id)} onToggleSave={() => user ? handleToggleSave(activeItem) : requireAuth('auth')} />}
                
                {view === 'business' && user && <BusinessDashboard onCreateBounty={() => {}} onCreateAd={handleCreateAd} activeAds={ads} theme={theme} />}
                {view === 'sell' && user && <SellPage onCancel={() => setView('feed')} onPost={handlePostListing} theme={theme} />}
                {view === 'profile' && user && <ProfileView user={user} theme={theme} onMarkSoldInitiate={(i) => { setPendingItem(i); setShowSold(true); }} showToast={showToast} onSpendPoints={() => showToast("Spent!")} onActivateBounty={() => showToast("Bounty Active!")} onClaimBounty={() => setShowBountyClaimModal(true)} onUpdateUser={(u) => setUser(u)} onLogout={handleLogout} onToggleSave={handleToggleSave} />}
                {view === 'forum' && user && <ForumView showToast={showToast} theme={theme} />}
                {view === 'admin' && <InventoryScout showToast={showToast} />}
                
                {/* INVESTOR VIEW */}
                {view === 'investor' && <InvestorDeck />}
            </main>

             <div className="fixed bottom-4 right-4 z-50 opacity-20 hover:opacity-100">
                <button onClick={() => setView(view === 'admin' ? 'feed' : 'admin')} className="p-2 bg-black text-white rounded-full"><Icons.Ghost className="w-4 h-4" /></button>
            </div>
        </div>
    );
};