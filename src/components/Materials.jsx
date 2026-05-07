import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { roomsActions } from '../store/rooms';
import { MAT } from '../util/data';
import { getRoomKey } from '../helper/GetRoomKey';

const Materials = () => {
    const [selectedMaterial, setSelectedMaterial] = useState({});
    const [items, setItems] = useState([]);

    const roomSelected = useSelector((state) => state.roomscontain.roomSelected);
    const dispatch = useDispatch();

    useEffect(() => {
        setSelectedMaterial({});
        setItems([]);
    }, [roomSelected]);

    useEffect(() => {
        dispatch(roomsActions.getSelectedItems(items));
    }, [items]);

    const handleSelect = (group, opt) => {
        const isDeselecting = selectedMaterial[group.key] === opt.id;

        setSelectedMaterial(prev => ({
            ...prev,
            [group.key]: isDeselecting ? null : opt.id,
        }));

        setItems(prev => {
            if (isDeselecting) {
                return prev.filter(item => item.group !== group.group);
            }
            const newItem = {
                group: group.group,
                key: group.key,
                id: opt.id,
                material: opt.label,
                cost: opt.cost,
            };
            const exists = prev.find(item => item.group === group.group);
            if (exists) {
                return prev.map(item => item.group === group.group ? newItem : item);
            }
            return [...prev, newItem];
        });
    };

    return (
        <div className="card bg-white bg-base-100 w-full mt-5 shadow">
            <div className="card-body">
                <h2 className="card-title">
                    <div className="card-ico">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                    </div>
                    <div>
                        <h2>Materials & Furniture</h2>
                        <div className="sub-title">
                            {roomSelected
                                ? `${roomSelected} — click to select, click again to deselect`
                                : 'Select a room to browse materials'}
                        </div>
                    </div>
                </h2>

                <div className="divider mt-0 before:h-px after:h-px"></div>

                {roomSelected ? (
                    MAT[getRoomKey(roomSelected)]?.map((group, index) => (
                        <div key={index} className="mb-6">
                            <div className="divider divider-start before:h-px after:h-px">
                                <span className="home-parts">{group.group}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {group.opts.map((opt) => {
                                    const isSelected = selectedMaterial[group.key] === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(group, opt)}
                                            className={`btn btn-sm bg-white btn-parts flex items-center gap-2 ${isSelected ? 'chipactive' : ''}`}
                                        >
                                            <span>{opt.label}</span>
                                            <span className="opacity-40 text-xs">{'$'.repeat(opt.cost)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center sub-title placeholder">Choose a room type above to browse materials & furniture.</p>
                )}
            </div>
        </div>
    );
};

export default Materials;
