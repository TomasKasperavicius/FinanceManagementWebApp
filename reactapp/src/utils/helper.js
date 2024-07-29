export function getUniquePropertyValues(object, property) {
    object = object || [];
    const uniqueValues = new Set();
    object.forEach(object => {
        if (object[property]) {
            uniqueValues.add(object[property]);
        }
    });

    return [...uniqueValues];
}