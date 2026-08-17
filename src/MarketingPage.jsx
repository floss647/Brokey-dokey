import React, { useState } from 'react';

// ─── ICONS (inline SVGs, no external deps) ────────────────────────────────────
const Icon = ({ path, size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {path}
    </svg>
);

const Icons = {
    Target: () => <Icon path={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />,
    Mail: () => <Icon path={<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>} />,
    Video: () => <Icon path={<><rect x="2" y="7" width="15" height="10" rx="2"/><polygon points="17 9 22 7 22 17 17 15"/></>} />,
    Search: () => <Icon path={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
    Chart: () => <Icon path={<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>} />,
    Zap: () => <Icon path={<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>} />,
    Calendar: () => <Icon path={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>} />,
    Users: () => <Icon path={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
    Gift: () => <Icon path={<><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></>} />,
    Wrench: () => <Icon path={<><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></>} />,
    ArrowRight: () => <Icon path={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>} />,
    CheckCircle: () => <Icon path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />,
    Clock: () => <Icon path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />,
    Play: () => <Icon path={<><polygon points="5 3 19 12 5 21 5 3"/></>} />,
    TrendingUp: () => <Icon path={<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>} />,
    Shield: () => <Icon path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>} />,
    Megaphone: () => <Icon path={<><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>} />,
    Star: () => <Icon path={<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>} />,
    Eye: () => <Icon path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />,
    Globe: () => <Icon path={<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>} />,
};

// ─── STYLE CONSTANTS ───────────────────────────────────────────────────────────
const S = {
    card: {
        background: '#ffffff',
        border: '2px solid #000000',
        boxShadow: '6px 6px 0px 0px #000000',
        borderRadius: '12px',
        padding: '24px',
    },
    cardSm: {
        background: '#ffffff',
        border: '2px solid #000000',
        boxShadow: '4px 4px 0px 0px #000000',
        borderRadius: '8px',
        padding: '16px',
    },
    yellowCard: {
        background: '#facc15',
        border: '2px solid #000000',
        boxShadow: '6px 6px 0px 0px #000000',
        borderRadius: '12px',
        padding: '24px',
    },
    blackCard: {
        background: '#000000',
        border: '2px solid #000000',
        boxShadow: '6px 6px 0px 0px #facc15',
        borderRadius: '12px',
        padding: '24px',
    },
    tag: (bg = '#facc15') => ({
        background: bg,
        border: '2px solid #000',
        borderRadius: '6px',
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: '800',
        fontFamily: "'Space Grotesk', sans-serif",
        letterSpacing: '0.08em',
        display: 'inline-block',
        boxShadow: '2px 2px 0px 0px #000',
        textTransform: 'uppercase',
    }),
    btn: {
        background: '#facc15',
        border: '2px solid #000',
        boxShadow: '4px 4px 0px 0px #000',
        borderRadius: '8px',
        padding: '10px 20px',
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: '800',
        fontSize: '13px',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        color: '#000',
    },
    heading: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: '#000',
    },
    subheading: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: '#000',
    },
    mono: {
        fontFamily: "'Chakra Petch', monospace",
        fontWeight: '700',
        color: '#000',
    },
    body: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: '400',
        color: '#374151',
        fontSize: '14px',
        lineHeight: '1.6',
    },
};

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const configs = {
        LIVE: { bg: '#4ade80', label: '● LIVE' },
        PLANNED: { bg: '#e5e7eb', label: '○ PLANNED' },
        BUILDING: { bg: '#facc15', label: '◑ BUILDING' },
        PAUSED: { bg: '#f87171', label: '⏸ PAUSED' },
        COMPLETE: { bg: '#a78bfa', label: '✓ COMPLETE' },
    };
    const cfg = configs[status] || configs.PLANNED;
    return <span style={S.tag(cfg.bg)}>{cfg.label}</span>;
};

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
        <div style={{
            background: '#facc15', border: '2px solid #000', borderRadius: '8px',
            width: '44px', height: '44px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '3px 3px 0px 0px #000', flexShrink: 0,
        }}>
            {icon}
        </div>
        <div>
            <h2 style={{ ...S.heading, fontSize: '22px', margin: 0 }}>{title}</h2>
            {subtitle && <p style={{ ...S.body, marginTop: '4px', color: '#6b7280' }}>{subtitle}</p>}
        </div>
    </div>
);

// ─── CAMPAIGN CARD ─────────────────────────────────────────────────────────────
const CampaignCard = ({ campaign }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div style={{ ...S.card, position: 'relative', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onClick={() => setExpanded(!expanded)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '6px 6px 0px 0px #000'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{
                    background: campaign.color, border: '2px solid #000', borderRadius: '8px',
                    width: '40px', height: '40px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                }}>
                    {campaign.emoji}
                </div>
                <StatusBadge status={campaign.status} />
            </div>
            <h3 style={{ ...S.heading, fontSize: '16px', marginBottom: '6px' }}>{campaign.name}</h3>
            <p style={{ ...S.body, fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>{campaign.mechanic}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: expanded ? '16px' : '0' }}>
                {campaign.kpis.map((kpi, i) => (
                    <div key={i} style={{ ...S.cardSm, padding: '8px 12px', boxShadow: '2px 2px 0px 0px #000', flex: '1', minWidth: '100px' }}>
                        <div style={{ ...S.mono, fontSize: '18px' }}>{kpi.value}</div>
                        <div style={{ ...S.body, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {expanded && (
                <div style={{ borderTop: '2px solid #000', paddingTop: '16px', marginTop: '8px' }}>
                    <p style={S.body}>{campaign.detail}</p>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {campaign.channels.map((ch, i) => (
                            <span key={i} style={S.tag('#e5e7eb')}>{ch}</span>
                        ))}
                    </div>
                </div>
            )}
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', opacity: 0.4, fontSize: '11px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700' }}>
                {expanded ? '▲ COLLAPSE' : '▼ EXPAND'}
            </div>
        </div>
    );
};

// ─── EMAIL FLOW DIAGRAM ────────────────────────────────────────────────────────
const EmailFlowDiagram = () => {
    const steps = [
        { day: 'D0', label: 'Welcome to\nthe Scrapyard', color: '#facc15', arrow: true },
        { day: 'D+1', label: 'First Listing\nNudge', color: '#ffffff', arrow: true, branch: 'IF no listing' },
        { day: 'D+3', label: '"Your junk has\n12 views"', color: '#4ade80', arrow: true, branch: 'IF listed' },
        { day: 'D+7', label: '"Your stuff is\nstill broken"', color: '#ff90e8', arrow: true, branch: 'IF no activity' },
        { day: 'D+14', label: '"Don\'t be\na div"', color: '#ef4444', textColor: '#fff', arrow: true },
        { day: 'D+30', label: 'Review\nRequest', color: '#a78bfa', arrow: false },
    ];

    return (
        <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', minWidth: '600px' }}>
                {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {step.branch && (
                                <div style={{
                                    ...S.body, fontSize: '10px', color: '#9ca3af', fontWeight: '700',
                                    textTransform: 'uppercase', letterSpacing: '0.06em',
                                    marginBottom: '6px', whiteSpace: 'nowrap'
                                }}>
                                    {step.branch}
                                </div>
                            )}
                            <div style={{
                                background: step.color,
                                border: '2px solid #000',
                                boxShadow: '3px 3px 0px 0px #000',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                width: '90px',
                                textAlign: 'center',
                            }}>
                                <div style={{ ...S.mono, fontSize: '13px', color: step.textColor || '#000' }}>{step.day}</div>
                                <div style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: '700', fontSize: '11px',
                                    color: step.textColor || '#000',
                                    marginTop: '4px', lineHeight: '1.3',
                                    whiteSpace: 'pre-line',
                                }}>
                                    {step.label}
                                </div>
                            </div>
                        </div>
                        {step.arrow && (
                            <div style={{
                                width: '28px', height: '2px', background: '#000',
                                position: 'relative', flexShrink: 0, marginTop: step.branch ? '26px' : '0',
                            }}>
                                <div style={{
                                    position: 'absolute', right: '-1px', top: '-4px',
                                    width: '0', height: '0',
                                    borderTop: '5px solid transparent',
                                    borderBottom: '5px solid transparent',
                                    borderLeft: '8px solid #000',
                                }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                {[
                    { color: '#facc15', label: 'Welcome / Onboarding' },
                    { color: '#4ade80', label: 'Positive Engagement' },
                    { color: '#ff90e8', label: 'Re-engagement' },
                    { color: '#ef4444', label: 'Final Nudge' },
                    { color: '#a78bfa', label: 'Post-Sale' },
                ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '14px', height: '14px', background: item.color, border: '2px solid #000', borderRadius: '3px' }} />
                        <span style={{ ...S.body, fontSize: '12px' }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── CONTENT CALENDAR GRID ─────────────────────────────────────────────────────
const ContentCalendarGrid = () => {
    const weeks = [
        {
            week: 'W1', theme: 'LAUNCH', items: [
                { type: 'SEO', text: 'Your Broken PS4 Is Worth More Than Your Dignity', color: '#4ade80' },
                { type: 'EMAIL', text: '"Welcome to the Scrapyard" — Day 0 welcome', color: '#facc15' },
                { type: 'VIDEO', text: 'Brand Launch Film (60 sec)', color: '#ff90e8' },
                { type: 'ADS', text: 'Google Seller Acquisition launch', color: '#93c5fd' },
            ]
        },
        {
            week: 'W2', theme: 'FOOTHOLD', items: [
                { type: 'SEO', text: 'The Complete Guide to Selling a Broken iPhone in 2025', color: '#4ade80' },
                { type: 'EMAIL', text: '"Your broken device is losing value by the minute" — D3 nudge', color: '#facc15' },
                { type: 'VIDEO', text: 'I Bought £500 of Broken Phones (haul + repair)', color: '#ff90e8' },
                { type: 'ADS', text: 'Meta retargeting launch (30s video creative)', color: '#93c5fd' },
            ]
        },
        {
            week: 'W3', theme: 'LAPTOP WEEK', items: [
                { type: 'SEO', text: 'Your Dead MacBook Isn\'t Dead — It\'s a Parts Farm Worth £200+', color: '#4ade80' },
                { type: 'EMAIL', text: '"Don\'t be a div — takes 3 minutes to list" — D7 stale sellers', color: '#facc15' },
                { type: 'VIDEO', text: 'Laptop Repair For Beginners — Fix or Sell?', color: '#ff90e8' },
                { type: 'ADS', text: 'Google: add MacBook keyword cluster', color: '#93c5fd' },
            ]
        },
        {
            week: 'W4', theme: 'COMMUNITY', items: [
                { type: 'SEO', text: 'Britain\'s E-Waste Problem Is Embarrassing and You\'re Part of It', color: '#4ade80' },
                { type: 'EMAIL', text: 'Newsletter #1 — Monthly community digest', color: '#facc15' },
                { type: 'VIDEO', text: 'Roast My Junk — Community Submissions Ep. 1', color: '#ff90e8' },
                { type: 'ADS', text: '"Roast My Junk" creative live on Meta', color: '#93c5fd' },
            ]
        },
    ];

    const typeColors = {
        'SEO': { bg: '#dcfce7', border: '#4ade80', label: 'SEO Blog' },
        'EMAIL': { bg: '#fef9c3', border: '#facc15', label: 'Email' },
        'VIDEO': { bg: '#fce7f3', border: '#f9a8d4', label: 'YouTube' },
        'ADS': { bg: '#dbeafe', border: '#93c5fd', label: 'Paid Ads' },
        'REDDIT': { bg: '#fef3c7', border: '#fcd34d', label: 'Reddit' },
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '700px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {weeks.map((week, wi) => (
                        <div key={wi} style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '2px solid #000' }}>
                                <span style={{ ...S.mono, fontSize: '22px' }}>{week.week}</span>
                                <span style={{ ...S.tag('#facc15'), fontSize: '10px' }}>{week.theme}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {week.items.map((item, ii) => {
                                    const tc = typeColors[item.type] || { bg: '#f3f4f6', border: '#9ca3af', label: item.type };
                                    return (
                                        <div key={ii} style={{
                                            background: tc.bg,
                                            border: `2px solid ${tc.border}`,
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                        }}>
                                            <div style={{
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                fontWeight: '800', fontSize: '9px',
                                                textTransform: 'uppercase', letterSpacing: '0.1em',
                                                color: '#6b7280', marginBottom: '3px',
                                            }}>
                                                {tc.label}
                                            </div>
                                            <div style={{ ...S.body, fontSize: '12px', lineHeight: '1.3', color: '#111' }}>
                                                {item.text}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── TOOL CARD ─────────────────────────────────────────────────────────────────
const ToolCard = ({ tool }) => (
    <div style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
                background: tool.color,
                border: '2px solid #000',
                borderRadius: '6px',
                width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: '800', fontFamily: "'Chakra Petch', monospace",
                flexShrink: 0,
            }}>
                {tool.abbr}
            </div>
            <span style={S.tag(tool.free ? '#4ade80' : '#fde68a')}>
                {tool.free ? 'FREE TIER' : tool.cost}
            </span>
        </div>
        <div>
            <div style={{ ...S.subheading, fontSize: '14px' }}>{tool.name}</div>
            <div style={{ ...S.body, fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{tool.category}</div>
        </div>
        <p style={{ ...S.body, fontSize: '12px', margin: 0 }}>{tool.purpose}</p>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700',
                fontSize: '10px', textTransform: 'uppercase', color: '#9ca3af',
            }}>AUTOMATES:</span>
            <span style={{ ...S.body, fontSize: '11px', color: '#374151' }}>{tool.automates}</span>
        </div>
    </div>
);

// ─── VIDEO ASSET CARD ──────────────────────────────────────────────────────────
const VideoAssetCard = ({ video }) => {
    const scriptColors = {
        'SCRIPTED': '#4ade80',
        'BRIEF ONLY': '#facc15',
        'IN PRODUCTION': '#ff90e8',
        'NEEDS SCRIPT': '#fca5a5',
    };

    return (
        <div style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000' }}>
            {/* Thumbnail Placeholder */}
            <div style={{
                background: video.thumbBg || '#000',
                border: '2px solid #000',
                borderRadius: '6px',
                height: '90px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    ...S.heading, fontSize: '11px', color: video.thumbTextColor || '#facc15',
                    textAlign: 'center', padding: '0 8px', lineHeight: '1.2',
                }}>
                    {video.title.toUpperCase()}
                </div>
                <div style={{
                    position: 'absolute', bottom: '6px', right: '6px',
                    background: '#facc15', border: '1px solid #000', borderRadius: '4px',
                    padding: '2px 6px', fontFamily: "'Chakra Petch', monospace",
                    fontWeight: '700', fontSize: '11px',
                }}>
                    {video.length}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ ...S.subheading, fontSize: '12px', flex: 1, paddingRight: '8px' }}>{video.title}</div>
                <span style={S.tag(scriptColors[video.scriptStatus] || '#e5e7eb')}>{video.scriptStatus}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {video.formats.map((f, i) => (
                    <span key={i} style={S.tag('#e5e7eb')}>{f}</span>
                ))}
            </div>
        </div>
    );
};

// ─── METRIC STAT ───────────────────────────────────────────────────────────────
const MetricStat = ({ label, value, delta, color = '#facc15' }) => (
    <div style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000', textAlign: 'center' }}>
        <div style={{ ...S.mono, fontSize: '32px', color: '#000' }}>{value}</div>
        <div style={{ ...S.body, fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.08em' }}>{label}</div>
        {delta && (
            <div style={{
                marginTop: '6px', fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '700', fontSize: '12px',
                color: delta.startsWith('+') ? '#16a34a' : '#dc2626',
            }}>
                {delta}
            </div>
        )}
    </div>
);

// ─── MAIN MARKETING PAGE ───────────────────────────────────────────────────────
export default function MarketingPage() {
    const [activeTab, setActiveTab] = useState('overview');

    const campaigns = [
        {
            name: 'DON\'T BIN IT — BRAND LAUNCH',
            mechanic: 'Hero film + Google Ads seller acquisition. Drive first 500 listings.',
            status: 'LIVE',
            emoji: '🚀',
            color: '#facc15',
            kpis: [
                { value: '500', label: 'Target Listings' },
                { value: '£0.80', label: 'Target CPC' },
                { value: '4%+', label: 'CTR Goal' },
            ],
            channels: ['Google Ads', 'YouTube', 'Meta Retargeting'],
            detail: 'The launch campaign runs for the first 4 weeks. Primary goal is seller acquisition — we need inventory before buyers. Budget split: 70% Google Search (seller keywords), 30% Meta retargeting (visitors who didn\'t convert).',
        },
        {
            name: 'ROAST MY JUNK — UGC SERIES',
            mechanic: 'Community submits broken devices. We roast them (and value them). Organic virality.',
            status: 'BUILDING',
            emoji: '💀',
            color: '#ff90e8',
            kpis: [
                { value: '10k', label: 'Views/Episode' },
                { value: '250', label: 'Submissions' },
                { value: '8%', label: 'List Rate' },
            ],
            channels: ['YouTube', 'Reddit', 'TikTok/Reels'],
            detail: 'Biweekly video series. Episode 1 uses team-sourced devices. From Episode 2, community submissions drive content. Each "roast" includes AI valuation + repair difficulty + market rate. Submissions collected via forum.',
        },
        {
            name: 'SEO CONTENT ENGINE',
            mechanic: 'Weekly blog targeting high-intent broken tech keywords. Compounding organic traffic.',
            status: 'LIVE',
            emoji: '📈',
            color: '#4ade80',
            kpis: [
                { value: '12', label: 'Posts in 90 Days' },
                { value: 'Top 10', label: '6-Mo Ranking Goal' },
                { value: '2k+', label: 'Monthly Organic' },
            ],
            channels: ['Blog/SEO', 'Google Search Console', 'Ahrefs'],
            detail: 'One SEO post per week targeting specific broken tech keywords ("sell broken PS4 UK", "broken MacBook worth"). Posts are 1,500-2,500 words, include price tables, schema markup, and internal links to listing flows. RankMath handles auto-submission to Google Indexing API.',
        },
        {
            name: 'KLAVIYO LIFECYCLE ENGINE',
            mechanic: 'Fully automated email sequences for sellers, buyers, and win-back. Set and forget.',
            status: 'BUILDING',
            emoji: '📧',
            color: '#a78bfa',
            kpis: [
                { value: '40%+', label: 'Open Rate Goal' },
                { value: '8%+', label: 'CTR Goal' },
                { value: '25%', label: 'Listing Rate' },
            ],
            channels: ['Klaviyo', 'Zapier', 'Internal Events'],
            detail: 'Six automated flows: (1) Seller welcome → listing nudge → stale listing, (2) Buyer browse abandonment, (3) Post-purchase + review request, (4) Win-back (30-day inactive), (5) BrokeyPoints milestone, (6) Monthly newsletter digest.',
        },
        {
            name: 'AFFILIATE FIXER PROGRAMME',
            mechanic: 'Top repair community members earn 10% commission on referrals. Word-of-mouth growth.',
            status: 'PLANNED',
            emoji: '🤝',
            color: '#fed7aa',
            kpis: [
                { value: '50', label: 'Target Affiliates' },
                { value: '£2', label: 'Per Listing CPL' },
                { value: '200', label: 'Referred Listings' },
            ],
            channels: ['Tapfiliate', 'Reddit/Discord', 'iFixit Community'],
            detail: 'Target: repair YouTube channels under 50k subs (high engagement, niche trust), Reddit repair community mods, iFixit forum contributors. Offer: 10% of successful listing value up to £5 per listing. Track via Tapfiliate unique links. Launch at Month 2.',
        },
    ];

    const tools = [
        { name: 'Ahrefs', abbr: 'Ah', category: 'SEO', color: '#fed7aa', free: false, cost: '£29/mo', purpose: 'Keyword research, rank tracking, backlink analysis', automates: 'Weekly email digest of rank movements' },
        { name: 'Klaviyo', abbr: 'Kl', category: 'Email', color: '#facc15', free: true, cost: '£20/mo', purpose: 'Behavioural email sequences, segmentation, A/B testing', automates: 'All lifecycle emails — zero manual sends' },
        { name: 'Buffer', abbr: 'Bf', category: 'Social', color: '#4ade80', free: true, cost: '£5/mo', purpose: 'Schedule 4 weeks of social posts in one session', automates: 'Auto-post from content queue on set schedule' },
        { name: 'Zapier', abbr: 'Zp', category: 'Automation', color: '#ff90e8', free: false, cost: '£16/mo', purpose: 'Connects all tools — the automation backbone', automates: 'New listing → email → social post → CRM update' },
        { name: 'CapCut', abbr: 'CC', category: 'Video', color: '#93c5fd', free: true, cost: '£0', purpose: 'Short-form video editing, auto-captions, templates', automates: 'Auto-caption + multi-ratio export in one click' },
        { name: 'OpusClip', abbr: 'Op', category: 'Video', color: '#c4b5fd', free: true, cost: '£15/mo', purpose: 'AI clips long videos into Shorts/Reels automatically', automates: '1 long video → 8 clips → scheduled across channels' },
        { name: 'Canva Pro', abbr: 'Ca', category: 'Design', color: '#fde68a', free: true, cost: '£13/mo', purpose: 'All social graphics, thumbnails, email headers', automates: 'Bulk create 100 listing cards from CSV data' },
        { name: 'Tapfiliate', abbr: 'Tp', category: 'Affiliate', color: '#bbf7d0', free: false, cost: '£59/mo', purpose: 'Affiliate programme management and tracking', automates: 'Auto-track, calculate, and pay affiliate commissions' },
    ];

    const videos = [
        { title: "Brand Launch Film — Don't Bin It. Bank It.", length: '60s', thumbBg: '#000', thumbTextColor: '#facc15', scriptStatus: 'SCRIPTED', formats: ['16:9', '9:16', '1:1', '30s Cut', '6s Bumper'] },
        { title: 'I Bought £500 of Broken Phones — Haul + Repair', length: '14min', thumbBg: '#facc15', thumbTextColor: '#000', scriptStatus: 'BRIEF ONLY', formats: ['16:9', '9:16 Reels'] },
        { title: 'Joy-Con Drift — Fix It or Sell It?', length: '8min', thumbBg: '#ff90e8', thumbTextColor: '#000', scriptStatus: 'NEEDS SCRIPT', formats: ['16:9', 'Shorts'] },
        { title: 'Roast My Junk — Episode 1', length: '12min', thumbBg: '#1a1a1a', thumbTextColor: '#ff90e8', scriptStatus: 'IN PRODUCTION', formats: ['16:9', '9:16', 'Clips x6'] },
        { title: 'BrokeyDokey Seller Guide (Screen Capture)', length: '6min', thumbBg: '#4ade80', thumbTextColor: '#000', scriptStatus: 'NEEDS SCRIPT', formats: ['16:9'] },
        { title: 'Inside a UK Repair Shop — Partner Collab', length: '10min', thumbBg: '#374151', thumbTextColor: '#facc15', scriptStatus: 'BRIEF ONLY', formats: ['16:9', 'Shorts'] },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'email', label: 'Email Flows' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'tools', label: 'Tools Stack' },
        { id: 'video', label: 'Video Assets' },
    ];

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#f9fafb', minHeight: '100vh' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Chakra+Petch:wght@600;700&family=Inter:wght@400;500;600&display=swap');
            `}</style>

            {/* ── HERO / WAR ROOM HEADER ── */}
            <div style={{
                background: '#000',
                borderBottom: '4px solid #facc15',
                padding: '32px 24px',
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div style={{ ...S.tag('#facc15'), fontSize: '12px', marginBottom: '12px' }}>ADMIN / INVESTOR VIEW</div>
                            <h1 style={{
                                ...S.heading,
                                fontSize: 'clamp(32px, 5vw, 60px)',
                                color: '#facc15',
                                margin: '0 0 8px',
                                lineHeight: '0.95',
                            }}>
                                MARKETING<br />WAR ROOM
                            </h1>
                            <p style={{ ...S.body, color: '#9ca3af', fontSize: '15px', marginTop: '8px' }}>
                                BrokeyDokey Growth Engine — 90-Day Launch Strategy
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Campaigns', value: '5' },
                                { label: 'Active Automations', value: '12' },
                                { label: 'Content Pieces', value: '60+' },
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    background: '#111', border: '2px solid #facc15',
                                    borderRadius: '8px', padding: '12px 20px', textAlign: 'center',
                                }}>
                                    <div style={{ ...S.mono, fontSize: '28px', color: '#facc15' }}>{stat.value}</div>
                                    <div style={{ ...S.body, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── TAB NAV ── */}
            <div style={{
                background: '#facc15',
                borderBottom: '3px solid #000',
                position: 'sticky', top: '0', zIndex: '10',
            }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0', overflowX: 'auto' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: '700', fontSize: '13px',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                                padding: '14px 20px',
                                background: activeTab === tab.id ? '#000' : 'transparent',
                                color: activeTab === tab.id ? '#facc15' : '#000',
                                border: 'none',
                                borderRight: '2px solid #000',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'background 0.15s',
                            }}>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── CONTENT AREA ── */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

                {/* ══ OVERVIEW TAB ══ */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {/* KPI Row */}
                        <div>
                            <SectionHeader icon={<Icons.Chart />} title="90-Day KPI Targets" subtitle="What success looks like at the end of the launch phase" />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                <MetricStat label="Total Listings" value="1,000" delta="+150/wk target" />
                                <MetricStat label="Registered Users" value="2,500" delta="Wk 12 goal" />
                                <MetricStat label="GMV (90d)" value="£45k" delta="~£45/listing avg" />
                                <MetricStat label="Email Open Rate" value="38%+" delta="Industry: 21%" />
                                <MetricStat label="E-Waste Diverted" value="500kg" delta="2.5t = 1 car" />
                                <MetricStat label="SEO Traffic" value="2k/mo" delta="By month 3" />
                            </div>
                        </div>

                        {/* Campaign Summary Strip */}
                        <div>
                            <SectionHeader icon={<Icons.Target />} title="Active Campaigns" subtitle="Click any campaign to expand details" />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {campaigns.slice(0, 3).map((c, i) => (
                                    <CampaignCard key={i} campaign={c} />
                                ))}
                            </div>
                        </div>

                        {/* Strategy Pillars */}
                        <div style={S.card}>
                            <SectionHeader icon={<Icons.Zap />} title="Strategic Pillars" subtitle="The three-lane growth engine" />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                                {[
                                    { label: 'PULL', title: 'SEO + Content', desc: 'High-intent keyword content brings sellers and buyers actively searching. Compounding. Cheap at scale. Takes 3-6 months to compound.', color: '#4ade80', icon: '📈' },
                                    { label: 'PUSH', title: 'Paid Ads', desc: 'Google Search for immediate seller acquisition. Meta retargeting for conversion. Reddit ads for community trust. Budget-controlled growth lever.', color: '#ff90e8', icon: '📢' },
                                    { label: 'RETAIN', title: 'Email + Community', desc: 'Klaviyo lifecycle keeps sellers listing and buyers buying. Forum drives organic community UGC. Referral programme multiplies word-of-mouth.', color: '#facc15', icon: '🔄' },
                                ].map((pillar, i) => (
                                    <div key={i} style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000', borderLeft: `4px solid ${pillar.color}` }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '24px' }}>{pillar.icon}</span>
                                            <div>
                                                <div style={S.tag(pillar.color)}>{pillar.label}</div>
                                                <div style={{ ...S.subheading, fontSize: '14px', marginTop: '4px' }}>{pillar.title}</div>
                                            </div>
                                        </div>
                                        <p style={{ ...S.body, fontSize: '13px', margin: 0 }}>{pillar.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ CAMPAIGNS TAB ══ */}
                {activeTab === 'campaigns' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <SectionHeader icon={<Icons.Megaphone />} title="All Campaigns" subtitle="Click to expand mechanic details, channels, and KPIs" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                            {campaigns.map((c, i) => (
                                <CampaignCard key={i} campaign={c} />
                            ))}
                        </div>

                        {/* Budget Split */}
                        <div style={S.card}>
                            <h3 style={{ ...S.heading, fontSize: '18px', marginBottom: '16px' }}>Monthly Budget Allocation</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'Google Ads (Seller Acquisition)', pct: 55, amount: '£500', color: '#4ade80' },
                                    { label: 'Meta Ads (Retargeting + Video)', pct: 25, amount: '£230', color: '#ff90e8' },
                                    { label: 'Reddit Ads (Community)', pct: 10, amount: '£90', color: '#facc15' },
                                    { label: 'Tool Subscriptions (non-ad)', pct: 10, amount: '£90', color: '#93c5fd' },
                                ].map((row, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ ...S.body, fontWeight: '600', fontSize: '13px' }}>{row.label}</span>
                                            <span style={{ ...S.mono, fontSize: '14px' }}>{row.amount}</span>
                                        </div>
                                        <div style={{ background: '#e5e7eb', borderRadius: '4px', height: '10px', border: '1px solid #000', overflow: 'hidden' }}>
                                            <div style={{ background: row.color, width: `${row.pct}%`, height: '100%', borderRadius: '3px' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ ...S.subheading, fontSize: '14px' }}>Total Monthly Budget</span>
                                <span style={{ ...S.mono, fontSize: '24px' }}>£910/mo</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ EMAIL FLOWS TAB ══ */}
                {activeTab === 'email' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <SectionHeader icon={<Icons.Mail />} title="Email Automation Flows" subtitle="Every sequence runs automatically via Klaviyo — zero manual sends required" />

                        <div style={S.card}>
                            <h3 style={{ ...S.heading, fontSize: '16px', marginBottom: '16px' }}>Seller Lifecycle Flow</h3>
                            <EmailFlowDiagram />
                        </div>

                        {/* All Flows Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                            {[
                                { name: 'Seller Welcome', trigger: 'User registers as seller', steps: 6, status: 'BUILDING', color: '#facc15', desc: 'Onboards new sellers from welcome → first listing → stale nudge → final push' },
                                { name: 'Buyer Browse Abandon', trigger: 'Item viewed, not purchased', steps: 3, status: 'PLANNED', color: '#ff90e8', desc: '2h → 24h → "it sold, here\'s similar" follow-up sequence' },
                                { name: 'Post-Purchase Journey', trigger: 'Order confirmed', steps: 4, status: 'BUILDING', color: '#4ade80', desc: 'BrokeyGuard™ confirm → delivery → review request → back-in-market nudge' },
                                { name: 'Win-Back', trigger: '30 days no login', steps: 3, status: 'PLANNED', color: '#a78bfa', desc: 'Miss you → final chance → sunset (clean list hygiene)' },
                                { name: 'Monthly Newsletter', trigger: 'Scheduled (monthly)', steps: 1, status: 'LIVE', color: '#93c5fd', desc: 'Top listings, community stats, forum picks, platform news' },
                                { name: 'BrokeyPoints Milestones', trigger: 'Points threshold reached', steps: 2, status: 'PLANNED', color: '#fed7aa', desc: '100pts → level up email → 500pts → "you\'re a legend" reward unlock' },
                            ].map((flow, i) => (
                                <div key={i} style={{ ...S.cardSm, boxShadow: '3px 3px 0px 0px #000', borderTop: `4px solid ${flow.color}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ ...S.subheading, fontSize: '14px' }}>{flow.name}</h3>
                                        <StatusBadge status={flow.status} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        <span style={S.tag('#e5e7eb')}>{flow.steps} STEPS</span>
                                        <span style={S.tag('#fef9c3')}>TRIGGER: {flow.trigger.toUpperCase().slice(0, 20)}...</span>
                                    </div>
                                    <p style={{ ...S.body, fontSize: '12px', margin: 0 }}>{flow.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Key email metrics */}
                        <div style={{ ...S.blackCard }}>
                            <h3 style={{ ...S.heading, fontSize: '16px', color: '#facc15', marginBottom: '16px' }}>Email Performance Targets</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                                {[
                                    { label: 'Open Rate (Welcome)', value: '45%+', bench: 'Industry: 21%' },
                                    { label: 'Open Rate (Nurture)', value: '30%+', bench: 'Industry: 18%' },
                                    { label: 'Click-Through Rate', value: '8%+', bench: 'Industry: 2.5%' },
                                    { label: 'Unsubscribe Rate', value: '<0.5%', bench: 'Healthy: <1%' },
                                ].map((m, i) => (
                                    <div key={i} style={{
                                        background: '#111', border: '2px solid #333',
                                        borderRadius: '8px', padding: '14px', textAlign: 'center',
                                    }}>
                                        <div style={{ ...S.mono, fontSize: '26px', color: '#facc15' }}>{m.value}</div>
                                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', marginTop: '4px' }}>{m.label}</div>
                                        <div style={{ ...S.body, fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>{m.bench}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ CALENDAR TAB ══ */}
                {activeTab === 'calendar' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <SectionHeader icon={<Icons.Calendar />} title="Content Calendar — Next 4 Weeks" subtitle="One post, one email, one video, one paid push per week. Machine-like." />
                        <ContentCalendarGrid />

                        {/* Phase Overview */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                            {[
                                { phase: 'PHASE 1', weeks: 'Weeks 1–2', label: 'LAUNCH', color: '#ff90e8', goal: 'Brand awareness + first 500 listings. Hero film. Google Ads live. SEO base built.' },
                                { phase: 'PHASE 2', weeks: 'Weeks 3–8', label: 'GROWTH', color: '#facc15', goal: 'Niche content weeks. Community building. Reddit organic. Roast My Junk goes live.' },
                                { phase: 'PHASE 3', weeks: 'Weeks 9–12', label: 'RETENTION', color: '#4ade80', goal: 'Power users rewarded. Environmental angle. Christmas push. 90-day impact report.' },
                            ].map((p, i) => (
                                <div key={i} style={{ ...S.card, borderTop: `4px solid ${p.color}` }}>
                                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                                        <span style={S.tag(p.color)}>{p.phase}: {p.label}</span>
                                        <span style={{ ...S.body, fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{p.weeks}</span>
                                    </div>
                                    <p style={{ ...S.body, fontSize: '13px', margin: 0 }}>{p.goal}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ TOOLS TAB ══ */}
                {activeTab === 'tools' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <SectionHeader icon={<Icons.Wrench />} title="Tools Stack" subtitle="Every tool automatable or set-and-forget. No daily scrolling required." />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                            {tools.map((tool, i) => (
                                <ToolCard key={i} tool={tool} />
                            ))}
                        </div>

                        {/* Automation Backbone */}
                        <div style={S.card}>
                            <SectionHeader icon={<Icons.Zap />} title="Zapier Automation Map" subtitle="The 6 core Zaps connecting the entire stack" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { label: 'ZAP 1 — Blog Pipeline', desc: 'New post published → Klaviyo email → Buffer social posts → Ahrefs rank alert', trigger: 'WordPress Publish', color: '#4ade80' },
                                    { label: 'ZAP 2 — New Listing', desc: 'Listing created → Klaviyo "listing live" email → Google Sheets CRM log', trigger: 'BrokeyDokey Event', color: '#facc15' },
                                    { label: 'ZAP 3 — New Registration', desc: 'User registered → Klaviyo sequence start → Tapfiliate referral check → Slack notify', trigger: 'User Signup', color: '#ff90e8' },
                                    { label: 'ZAP 4 — Stale Listing', desc: 'Listing age >14d + no offers → trigger nudge email → log in Notion', trigger: 'Sheets Condition', color: '#a78bfa' },
                                    { label: 'ZAP 5 — UGC Capture', desc: '#brokeydokey Instagram tag → save to Drive → Slack notify for review', trigger: 'Instagram Tag', color: '#93c5fd' },
                                    { label: 'ZAP 6 — Review Request', desc: 'Order delivered status → 5d delay → Klaviyo review request sequence', trigger: 'Delivery Confirm', color: '#fed7aa' },
                                ].map((zap, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f9fafb', border: '2px solid #000', borderRadius: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', background: zap.color, border: '2px solid #000', borderRadius: '50%', marginTop: '4px', flexShrink: 0 }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ ...S.subheading, fontSize: '13px', marginBottom: '3px' }}>{zap.label}</div>
                                            <p style={{ ...S.body, fontSize: '12px', margin: 0 }}>{zap.desc}</p>
                                        </div>
                                        <span style={S.tag('#e5e7eb')}>{zap.trigger}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cost summary */}
                        <div style={{ ...S.yellowCard }}>
                            <h3 style={{ ...S.heading, fontSize: '18px', marginBottom: '16px' }}>Monthly Tool Cost</h3>
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ ...S.mono, fontSize: '48px' }}>£157</div>
                                    <div style={{ ...S.body, fontWeight: '600', textTransform: 'uppercase', fontSize: '12px' }}>Tools Only (excl. ad spend)</div>
                                </div>
                                <div>
                                    <div style={{ ...S.mono, fontSize: '48px' }}>£0</div>
                                    <div style={{ ...S.body, fontWeight: '600', textTransform: 'uppercase', fontSize: '12px' }}>Bootstrap mode (free tiers only)</div>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <p style={{ ...S.body, fontSize: '13px', margin: 0 }}>
                                        GA4 + Search Console + Canva Free + Buffer Free + Klaviyo Free + CapCut + Make Free = fully functional marketing stack at £0 until you hit 500 email subscribers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ VIDEO ASSETS TAB ══ */}
                {activeTab === 'video' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <SectionHeader icon={<Icons.Video />} title="Video Asset Library" subtitle="Every video ships in 16:9, 9:16, and 1:1 unless noted. One shoot = multiple platforms." />

                        {/* Status legend */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {[
                                { status: 'SCRIPTED', color: '#4ade80', desc: 'Script complete, ready to film' },
                                { status: 'IN PRODUCTION', color: '#ff90e8', desc: 'Currently filming/editing' },
                                { status: 'BRIEF ONLY', color: '#facc15', desc: 'Treatment written, needs full script' },
                                { status: 'NEEDS SCRIPT', color: '#fca5a5', desc: 'Concept only — not started' },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={S.tag(s.color)}>{s.status}</span>
                                    <span style={{ ...S.body, fontSize: '12px', color: '#6b7280' }}>{s.desc}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                            {videos.map((v, i) => (
                                <VideoAssetCard key={i} video={v} />
                            ))}
                        </div>

                        {/* Production Notes */}
                        <div style={S.card}>
                            <h3 style={{ ...S.heading, fontSize: '16px', marginBottom: '16px' }}>Production Principles</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {[
                                    { icon: '🎨', title: 'Colour Grade', desc: 'B&W opening → desaturated mid → full warm colour as device enters the BrokeyDokey ecosystem. Visual metaphor for the product.' },
                                    { icon: '🎵', title: 'Music Vibe', desc: 'Orchestral drama → indie-electronic pivot at 0:25. Deadpan British deadpan energy. Lo-fi for tutorials. Game show stabs for Roast episodes.' },
                                    { icon: '✂️', title: 'Edit Style', desc: 'Cut on action. Hard cuts only — no cross-dissolves. On-screen text slapped in (not animated). Captions always on.' },
                                    { icon: '📐', title: 'Format Rule', desc: 'Frame all hero shots centre-frame for 9:16 reframe. Record horizontal. Reframe vertical in post. One shoot, all platforms.' },
                                ].map((note, i) => (
                                    <div key={i} style={{ ...S.cardSm, boxShadow: '2px 2px 0px 0px #000' }}>
                                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{note.icon}</div>
                                        <div style={{ ...S.subheading, fontSize: '13px', marginBottom: '6px' }}>{note.title}</div>
                                        <p style={{ ...S.body, fontSize: '12px', margin: 0 }}>{note.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* ── FOOTER ── */}
            <div style={{
                background: '#000', borderTop: '4px solid #facc15',
                padding: '24px', marginTop: '40px', textAlign: 'center',
            }}>
                <div style={{ ...S.mono, fontSize: '18px', color: '#facc15' }}>BROKEYDOBKEY</div>
                <div style={{ ...S.body, color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>DON'T BIN IT. BANK IT. — Marketing War Room v1.0</div>
            </div>
        </div>
    );
}
