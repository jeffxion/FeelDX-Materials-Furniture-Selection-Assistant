import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomsActions } from '../store/rooms';
import { ROOMS } from '../util/data';

const RoomType = () => {
    const [selected, setSelected] = useState(null);

    const selectedItems = useSelector((state) => state.roomscontain.selectedItems);
    const dispatch = useDispatch();

    const handleSelectedRoom = (label, index) => {
        setSelected(index);
        if (selectedItems.length !== 0) {
            dispatch(roomsActions.getSelectedItems([]));
        }
        dispatch(roomsActions.getSelectedRoom(label));
    };

    return (
        <>
            <div className="card bg-white bg-base-100 w-full shadow">
                <div className="card-body">
                    <h2 className="card-title">
                        <div className="card-ico">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                            </svg>
                        </div>
                        <div>
                            <h2>Room Type</h2>
                            <div className="sub-title">Select the space you want to design</div>
                        </div>
                    </h2>
                    <div className="divider mt-0 before:h-px after:h-px"></div>
                    <div className="flex flex-wrap gap-4">
                        {ROOMS.map((room, index) => (
                            <div
                                key={room.id}
                                className="flex-1 min-w-[120px] max-w-[160px] cursor-pointer"
                                onClick={() => handleSelectedRoom(room.label, index)}
                            >
                                <div className={`card text-center card-xs shadow-sm transition-all
                                    ${selected === index
                                        ? 'bg-amber-50 border border-amber-400'
                                        : 'bg-base-100 border border-base-200'
                                    }`}
                                >
                                    <div className="card-body p-6 items-center">
                                        <span className="r-emoji">{room.emoji}</span>
                                        <p className={`r-name text-sm font-medium
                                            ${selected === index ? 'text-amber-500' : 'text-base-content'}`}
                                        >
                                            {room.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomType;
