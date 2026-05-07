import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { roomsActions } from '../store/rooms';
import { ROOMS, COST_CONFIG,  } from '../util/data';
import { ROOM_CATEGORIES, getCostTier, AI_RULES } from '../util/dummyData';
import { getRoomKey } from '../helper/GetRoomKey';

const evaluateRules = (roomId, selectedItems) => {
    if (!roomId || !selectedItems?.length) return { flags: [], insights: [] };

    const sel = {};
    selectedItems.forEach(item => {
        sel[item.key] = item.id;
    });

    const flags = [];
    const insights = [];

    AI_RULES.forEach(rule => {
        if (rule.rooms && !rule.rooms.includes(roomId)) return;
        try {
            if (rule.check(sel)) {
                if (rule.type === 'flag') flags.push(rule);
                if (rule.type === 'insight') insights.push(rule);
            }
        } catch (e) {
            console.warn(`Rule "${rule.id}" failed:`, e.message);
        }
    });

    return { flags, insights };
};

const AISummary = () => {
    const selectedItems = useSelector((state) => state.roomscontain.selectedItems);
    const roomSelected  = useSelector((state) => state.roomscontain.roomSelected);
    const dispatch = useDispatch();

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [triggeredRules, setTriggeredRules] = useState({ flags: [], insights: [] });
    const [costTier, setCostTier] = useState(null);
    const [missingItems, setMissingItems] = useState([]);

    useEffect(() => {
        const room = ROOMS.find(r => r.id === getRoomKey(roomSelected));
        setSelectedRoom(room ?? null);
        setShowSummary(false);
    }, [roomSelected]);

    useEffect(() => {
        const roomId = getRoomKey(roomSelected);
        setTriggeredRules(evaluateRules(roomId, selectedItems));
        setCostTier(getCostTier(selectedItems));

        const ALL_KEYS     = ROOM_CATEGORIES[roomId] ?? [];
        const selectedKeys = selectedItems?.map(i => i.group) ?? [];
        setMissingItems(ALL_KEYS.filter(k => !selectedKeys.includes(k)));
    }, [roomSelected, selectedItems]);

    const handleGenerate = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowSummary(true);
            dispatch(roomsActions.setAiGenerated(true));
        }, 1300);
    };

    const cost = costTier ? COST_CONFIG[costTier] : null;
    const hasRoom = !!selectedRoom;
    const hasSelections = selectedItems?.length > 0;

    return (
        <div className="mb-5 card bg-stone-800 text-white w-full shadow">
            <div className="card-body">

                <div className="card-title ai-title">AI Design Analysis</div>
                <div className="divider divider-accent mt-0 before:h-px after:h-px"></div>

                {isLoading && (
                    <div className="flex gap-1 items-center py-4 justify-center">
                        <span className="loading loading-dots loading-sm text-accent"></span>
                    </div>
                )}

                {!isLoading && showSummary && hasRoom && (
                    <div className="flex flex-col gap-4">

                        <div className="ai-section">
                            <p className="ai-sub-title">Overview</p>
                            <p className="ai-txt">
                                Analysing your <strong>{selectedRoom.label}</strong> — {selectedItems.length} of 5 categories selected.
                            </p>
                        </div>

                        {cost && (
                            <div className="ai-section">
                                <p className="ai-sub-title">Cost Analysis</p>
                                <p className="ai-txt">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${cost.color} ${cost.bg}`}>
                                        {cost.label.toUpperCase()}
                                    </span>
                                    {cost.message}
                                </p>
                            </div>
                        )}

                        {triggeredRules.flags.length > 0 && (
                            <div className="ai-section">
                                <p className="ai-sub-title">Compatibility Flags</p>
                                <ul className="flex flex-col gap-2">
                                    {triggeredRules.flags.map(rule => (
                                        <li key={rule.id} className="ai-txt flex gap-2 items-start">
                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-orange-900/40 text-orange-400 shrink-0 mt-0.5">⚠</span>
                                            {rule.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {missingItems.length > 0 && (
                            <div className="ai-section">
                                <p className="ai-sub-title">Missing Selections</p>
                                <ul className="flex flex-col gap-1">
                                    {missingItems.map(key => (
                                        <li key={key} className="ai-txt capitalize">→ {key}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {triggeredRules.insights.length > 0 && (
                            <div className="ai-section">
                                <p className="ai-sub-title">Design Insights</p>
                                <ul className="flex flex-col gap-2">
                                    {triggeredRules.insights.map(rule => (
                                        <li key={rule.id} className="ai-txt flex gap-2 items-start">
                                            <span className="text-accent shrink-0">→</span>
                                            {rule.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="ai-section">
                            <p className="ai-sub-title">Recommended Actions</p>
                            <ul className="flex flex-col gap-1">
                                {missingItems.length > 0 && (
                                    <li className="ai-txt">→ Complete missing selections: {missingItems.join(', ')}.</li>
                                )}
                                <li className="ai-txt">→ Request physical samples to verify colour and texture under natural light.</li>
                                <li className="ai-txt">→ Obtain at least 3 contractor quotes before committing.</li>
                                {costTier === 'high' && (
                                    <li className="ai-txt">→ Consider a value-engineering review to identify where premium items can be substituted.</li>
                                )}
                            </ul>
                        </div>

                    </div>
                )}

                {!isLoading && !showSummary && (
                    <p className="text-center sub-title placeholder py-4">
                        {hasRoom
                            ? 'Click Generate to receive your personalised design analysis.'
                            : 'Choose a room type above to browse materials & furniture.'}
                    </p>
                )}

                <button
                    className="btn btn-accent mt-5 btn-block"
                    onClick={handleGenerate}
                    disabled={!hasRoom || !hasSelections || isLoading}
                >
                    {isLoading ? 'Analysing...' : 'Generate AI Summary'}
                </button>

            </div>
        </div>
    );
};

export default AISummary;
