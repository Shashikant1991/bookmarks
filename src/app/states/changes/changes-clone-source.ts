export function ChangesCloneSource(source: any): any {
    const value = {};
    Object.keys(source)
        .filter(key => !['id', 'modified', 'created'].includes(key) && !key.startsWith('_'))
        .forEach(key => value[key] = JSON.parse(JSON.stringify(source[key])));
    return value;
}
