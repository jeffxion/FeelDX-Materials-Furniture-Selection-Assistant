export const getRoomKey = (label) => {
    return label?.toLowerCase().replace(/\s+/g, '_');
}