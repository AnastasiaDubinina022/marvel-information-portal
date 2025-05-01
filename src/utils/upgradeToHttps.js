
function upgradeToHttps(url) {
    if (typeof url !== 'string') return url;  // защита от нестроковых типов которые могут случайно попасть и вызвать ошибку
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://')  // замена http на https
    }
    return url; 
}

export default upgradeToHttps;