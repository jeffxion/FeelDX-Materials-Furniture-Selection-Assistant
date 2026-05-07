import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ROOMS, MAT } from '../util/data';
import { getRoomKey } from '../helper/GetRoomKey';
import { getCostTier } from '../util/dummyData';

const DOMINANT_COLORS = {
    low:    'text-green-600 bg-green-50 border-green-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    high:   'text-red-600 bg-red-50 border-red-200',
};

const DOMINANT_LABELS = {
    low:    'Low Cost',
    medium: 'Mid Range',
    high:   'Premium',
};

const Summary = () => {
    const roomSelected = useSelector((state) => state.roomscontain.roomSelected);
    const selectedItems = useSelector((state) => state.roomscontain.selectedItems);

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [dominant, setDominant] = useState(null);

    useEffect(() => {
        const room = ROOMS.find(r => r.id === getRoomKey(roomSelected));
        setSelectedRoom(room ?? null);
    }, [roomSelected]);

    useEffect(() => {
        setDominant(getCostTier(selectedItems));
    }, [selectedItems]);

    return (
        <div className="mb-5 card bg-white bg-base-100 w-full shadow">
            <div className="card-body">
                <h2 className="card-title">
                    <div className="card-ico">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                        </svg>
                    </div>
                    <div>
                        <h2>Selection Summary</h2>
                        <div className="sub-title">Your current design selections</div>
                    </div>
                </h2>

                <div className="divider mt-0 before:h-px after:h-px"></div>

                {selectedRoom ? (
                    <>
                        <div className="flex justify-start align-middle gap-3">
                            <div className="card-ico select-icon">
                                <span className="r-emoji">{selectedRoom.emoji}</span>
                            </div>
                            <div>
                                <h2 className="selected-name">{selectedRoom.label}</h2>
                                <div className="sub-title">{selectedItems.length} of 5 items selected</div>
                            </div>
                        </div>

                        <div className="divider mt-0 before:h-px after:h-px"></div>

                        <ul className="list bg-white rounded-box">
                            {MAT[getRoomKey(roomSelected)]?.map((group, index) => (
                                <li key={index} className="list-row">
                                    <div className="text-xs uppercase font-semibold opacity-60 s-key">
                                        {group.group}
                                    </div>
                                    {selectedItems.map((item) => (
                                        item.group === group.group && (
                                            <div key={item.group} className="flex justify-end s-val">
                                                <span>{'$'.repeat(item.cost)} {item.material}</span>
                                            </div>
                                        )
                                    ))}
                                </li>
                            ))}
                        </ul>

                        {dominant && (
                            <div className="cost-range">
                                <p className="text-xs uppercase font-semibold opacity-60 s-key">Budget Estimate</p>
                                <div className={`mt-2 text-xs font-semibold px-2 py-1 rounded border w-fit ${DOMINANT_COLORS[dominant]}`}>
                                    {DOMINANT_LABELS[dominant]}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center sub-title placeholder">Your selected materials will appear here.</p>
                )}
            </div>
        </div>
    );
};

export default Summary;
